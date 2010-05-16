from sqlalchemy import *
#~ from medienverwaltungweb.model import meta
import meta
import tag

media_table = Table('media', meta.metadata,
    Column('id', Integer, primary_key=True),
    Column('title', Unicode(100)),
    Column('image_data', PickleType(mutable=False)),
    Column('media_type_id', Integer, ForeignKey('media_types.id')),
    Column('isbn', String(15)),
    Column('created_ts', DateTime),
    Column('updated_ts', DateTime),
    Column('image_crop', PickleType(mutable=False)),
)

class Medium(object):
    def __unicode__(self):
        return "<Medium(%s, '%s')>" % (self.id, self.title)

    #~ __str__ = __unicode__

    def __repr__(self):
        return self.__unicode__().encode('ascii', 'replace')

    def get_tagstring(self):
        retval = ""
        for item in self.tags:
            if len(retval) > 0:
                retval += " "

            retval += item.name

        return retval

    def set_tagstring(self, s):
        tag_names = map(lambda x: x.name, self.tags)
        for item in s.split(' '):
            if item:
                if not item in tag_names:
                    mytag = tag.Tag()
                    mytag.name = item
                    self.tags.append(mytag)
                else:
                    tag_names.remove(item)

        for item in tag_names:
            for tagobj in self.tags:
                if tagobj.name == item:
                    self.tags.remove(tagobj)
                    break
