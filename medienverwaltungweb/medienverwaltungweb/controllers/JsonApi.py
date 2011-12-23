import logging
import json

from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect

from medienverwaltungweb.lib.base import BaseController, render

from medienverwaltungweb.model import meta
import medienverwaltungweb.model as model
import medienverwaltungweb.lib.amazon as amazon


log = logging.getLogger(__name__)

class JsonapiController(BaseController):

    @property
    def allow_openid(self):
        return False

    def index(self):
        return 'Hello World'

    def isbn(self):
        isbn = request.params.get('q')
        log.debug("isbn: %s" % isbn)
        if not c.user:
            self.login_user()

        retval = {'isbn':isbn, 'media': []}

        query = meta.Session\
                          .query(model.Medium)\
                          .filter(model.Medium.isbn==isbn)

        log.debug("query.count(): %s" % query.count())
        if query.count() == 0:
            log.debug("COUNT")
            search_index = 'Books'
            amazon_retval = amazon.AddMediumByISBN(isbn, search_index)
            log.debug("amazon_retval: %s" % amazon_retval)

        for medium in query:
            retval['media'].append({'id':medium.id,
                                    'title':medium.title})


        #~ c.media_page = paginate.Page(media_query)

        return json.dumps(retval)




