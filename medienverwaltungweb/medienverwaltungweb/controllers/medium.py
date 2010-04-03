import logging
import Image, ImageFile
from StringIO import StringIO
from datetime import datetime

from sqlalchemy import func
from sqlalchemy.sql import select, join, and_, or_, not_
from webhelpers import paginate
from pylons import request, response, session, tmpl_context as c
from pylons.controllers.util import abort, redirect_to, etag_cache

import medienverwaltungweb.lib.helpers as h
from medienverwaltungweb.lib.base import BaseController, render
from medienverwaltungweb.model import meta
import medienverwaltungweb.model as model

log = logging.getLogger(__name__)

class MediumController(BaseController):
    def index(self, id=None, type=None, page=1, tag=None):
        if id:
            return self.edit(id)
        else:
            return self.list(type, page, tag)

    def mass_add(self):
        c.types = meta.Session.query(model.MediaType).all()
        return render('medium/mass_add.mako')

    def mass_add_post(self):
        if not request.params.get('title'):
            h.flash("please specify name")
            return redirect_to(action='mass_add')

        count = 0
        for item in request.params.get('title').split('\n'):
            if not item:
                continue
                
            query = meta.Session\
                .query(model.Medium)\
                .filter(model.Medium.title==item)
            if query.first() != None:
                h.flash("medium elready exists: %s" % query.first())
                continue
                
            record = model.Medium()
            record.title = item.strip()
            record.created_ts = datetime.now()
            record.updated_ts = datetime.now()
            record.media_type_id = request.params.get('media_type')
            meta.Session.save(record)
            count += 1
        meta.Session.commit()

        h.flash("added: %s media" % count)
        return redirect_to(action='index')

    def list(self, type=None, page=1, tag=None):
        self.__prepare_list__(False, type, page, tag)
        if type:
            c.title = "All %s" % type.capitalize()
        else:
            c.title = "All Media"

        if tag:
            c.title += " tagged %s" % tag.capitalize()
            
        c.pager_action = "list"
        return render('medium/list.mako')

    def list_gallery(self, type=None, page=1, tag=None):
        self.__prepare_list__(True, type, page, tag)
        if type:
            c.title = "%s Gallery" % type.capitalize()
        else:
            c.title = "All Media Gallery"

        if tag:
            c.title += " tagged %s" % tag.capitalize()
            
        c.pager_action = "list_gallery"
        return render('medium/list_gallery.mako')

    def __get_tags__(self, tag_name, media_type_name):
        """ get all tags from all media.
            If tag_name is specified only media tagged with this is
            considered.
            If media_type_name is specified only media by this type
            is considered.
            Returns a tuple (tag_name, count) for each tag.
        """
        join_clause = model.tags_table.join(model.media_table)

        if tag_name:
            sub_tags_table = model.tags_table.alias('sub_tags')
            join_clause = join_clause.join(sub_tags_table)

        if media_type_name:
            sub_media_types_table = model.media_types_table.alias('sub_media_types_table')
            join_clause = join_clause.join(sub_media_types_table)

        cnt_col = func.count()
        tag_query = select([model.tags_table.c.name, cnt_col],
                           from_obj=[join_clause])

        if tag_name:
            tag_query = tag_query.where(sub_tags_table.c.name==tag_name)
            tag_query = tag_query.where(model.tags_table.c.name != tag_name)
            
        if media_type_name:
            tag_query = tag_query.where(sub_media_types_table.c.name==media_type_name)
            
        #~ tag_query = tag_query.distinct()
        tag_query = tag_query.group_by(model.tags_table.c.name)\
                             .order_by(cnt_col.desc())
        tag_query.bind = meta.engine
        retval = map(lambda x: (x[0], x[1]), tag_query.execute())
        #~ if tag_name in retval:
            #~ retval.remove(tag_name)
        return retval
        
    def __prepare_list__(self, with_images, type=None, page=1, tag=None):
        if type and type[-1:] == 's':
            type = type[:-1]

        log.debug("type: %s" % type)
        c.tags = self.__get_tags__(tag, type)
        log.debug("c.tags: %s" % len(c.tags))
        
        query = meta.Session.query(model.Medium)
        
        if type:
            query = query.join(model.MediaType)\
                         .filter(model.MediaType.name==type)

        log.debug("tag: %s" % tag)
        if tag:
            query = query.join(model.Tag)\
                         .filter(model.Tag.name==tag)

        if with_images:
            query = query.filter(model.Medium.image_data!=None)

        c.order = request.params.get('order')
        if not c.order:
            query = query.order_by(model.Medium.title)
        elif c.order.endswith('_desc'):
            #~ real_order = c.order[:-5]
            #~ log.debug("real_order: %s" % real_order)
            query = query.order_by(model.Medium.__dict__[c.order[:-5]].desc())
        else:
            query = query.order_by(model.Medium.__dict__[c.order])
            
        #~ c.items = query.all()
        log.debug("c.items: %s" % len(c.items))
        c.page = paginate.Page(query, page)

    def list_no_image(self, page=1):
        query = meta.Session\
            .query(model.Medium)\
            .filter(model.Medium.image_data == None)
        query = query.order_by(model.Medium.id.desc())
        c.items = query.all()
        c.page = paginate.Page(query, page)
        c.title = "Media without images"
        c.pager_action = "list_no_image"
        return render('medium/list.mako')

    def delete(self):
        for item in h.checkboxes(request, 'item_id_'):
            db_item = meta.find(model.Medium, item)
            meta.Session.delete(db_item)
            h.flash("deleted: %s" % db_item)

        meta.Session.commit()

        return redirect_to(action='index')

    def delete_one(self, id):
        log.debug("delete_one(%s)" % id)
        db_item = meta.find(model.Medium, id)
        meta.Session.delete(db_item)
        meta.Session.commit()
        h.flash("deleted: %s" % db_item)
        return redirect_to(action='index', id=None)

    def edit(self, id):
        log.debug("id: %s" % id)
        c.item = meta.find(model.Medium, id)
        c.persons = {}

        query = meta.Session.query(model.MediaToAsin)
        result = query.filter(model.MediaToAsin.media_id==id).all()
        c.asins = []
        for item in result:
            c.asins.append(item.asin)

        query = meta.Session\
            .query(model.PersonToMedia)\
            .filter(model.PersonToMedia.medium_id==id)\
            .all()
        for item in query:
            log.debug("Person2: %s" % item.person)

            if item.relation.name in c.persons:
                c.persons[item.relation.name].append(item.person)
            else:
                c.persons[item.relation.name] = [item.person]

        c.borrowed_by = meta.Session.query(model.Borrower)\
                                    .join(model.BorrowAct)\
                                    .filter(model.BorrowAct.media_id == id)\
                                    .filter(model.BorrowAct.returned_ts == None)\
                                    .first()
        return render('medium/edit.mako')

    def edit_post(self):
        id = request.params.get('id')
        item = meta.find(model.Medium, id)
        item.title = request.params.get('title')
        item.image_url = request.params.get('image_url')
        item.updated_ts = datetime.now()
        item.set_tagstring(request.params.get('tags'))
        meta.Session.update(item)
        meta.Session.commit()
        h.flash("updated: %s" % item)

        return_to = request.params.get('return_to')
        log.debug("return_to: %s" % return_to)
        if return_to:
            return redirect_to(str(return_to))
        else:
            #~ return redirect_to()
            return redirect_to(action='edit', id=id)
            
        #~ return redirect_to(action='edit', id=id)

    def image(self, id, width, height):
        item = meta.find(model.Medium, id)

        p = ImageFile.Parser()
        p.feed(item.image_data.getvalue())
        #~ p.feed(StringIO(item.image_data.getvalue()))
        img = p.close()

        #~ log.debug("size: %s, %s" % (width, height))
        size = int(width), int(height)
        img.thumbnail(size)
        #~ log.debug("imgsize: %s, %s" % img.size)

        buffer = StringIO()
        img.save(buffer, format='png')
        response.content_type = 'image/png'

        etag_cache(str(item.updated_ts))
        return buffer.getvalue()

        # set the response type to PNG, since we at least hope to return a PNG image here
        #~ return item.image_data.getvalue()
        #~ return img.tostring()

    def next_without_image(self, id):
        query = meta.Session\
            .query(model.Medium)\
            .filter(model.Medium.image_data == None)\
            .filter(model.Medium.id < id)\
            .order_by(model.Medium.id.desc())

        medium = query.first()
        if not medium:
            h.flash("all media after this have a image")
            return redirect_to(action='edit', id=id)
            
        return redirect_to(action='edit', id=medium.id)
        
