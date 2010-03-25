import logging

from webhelpers import paginate
import urllib
from pylons import request, response, session, tmpl_context as c
from pylons.controllers.util import abort, redirect_to

from medienverwaltungweb.lib.base import BaseController, render
import medienverwaltungweb.model as model
from medienverwaltungweb.model import meta

log = logging.getLogger(__name__)

class PersonController(BaseController):

    def index(self, id=None):
        # Return a rendered template
        #return render('/actor.mako')
        # or, return a response
        if id:
            return self.edit(id)
        else:
            return 'Hello World. Need id.'

    def edit(self, id, page=1):
        c.item = meta.find(model.Person, id)

        query = meta.Session\
            .query(model.Medium)\
            .join(model.PersonToMedia)\
            .filter(model.PersonToMedia.person_id == id)
        c.page = paginate.Page(query, page)

        return render('person/display.mako')

    def list(self, page=1):
        query = meta.Session.query(model.Person)
        c.page = paginate.Page(query, page)

        return render('person/list.mako')
