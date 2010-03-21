import logging
import amazonproduct
import urllib

from pylons import request, response, session, tmpl_context as c
from pylons.controllers.util import abort, redirect_to
from pylons import config

from medienverwaltungweb.lib.base import BaseController, render
import medienverwaltungweb.lib.helpers as h

log = logging.getLogger(__name__)

class AmazonController(BaseController):

    def index(self):
        return render('/amazon/add_these.mako')

    def add_one_post(self):
        add_this = request.params.get('add_this', None)
        api = amazonproduct.API(config['Amazon.AccessKeyID'],
                                config['Amazon.SecretAccessKey'])

        SearchIndex = 'DVD'
        log.debug("add_this: %s" % add_this)
        node = api.item_search(SearchIndex,
                               Title=add_this.encode('utf-8'),
                               ResponseGroup="Images,ItemAttributes")
        c.items = node.Items.Item
        c.query = add_this
        return render('/amazon/item_search_resqult.mako')
