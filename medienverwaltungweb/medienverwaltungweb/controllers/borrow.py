import logging
from datetime import datetime

from pylons import request, response, session, tmpl_context as c
from pylons.controllers.util import abort, redirect_to
from webhelpers import paginate

from medienverwaltungweb.lib.base import BaseController, render
from medienverwaltungweb.model import meta
import medienverwaltungweb.model as model
import medienverwaltungweb.lib.helpers as h

log = logging.getLogger(__name__)

class BorrowController(BaseController):
    def index(self):
        # Return a rendered template
        #return render('/borrow.mako')
        # or, return a response
        return 'Hello World'

    def checkout(self, id):
        c.item = meta.find(model.Medium, id)
        c.borrowers = meta.Session\
                          .query(model.Borrower)\
                          .order_by(model.Borrower.id.desc())\
                          .all()
        return render('borrow/borrow.mako')

    def checkout_post(self):
        #~ id = request.params.get('id')
        borrower_id = request.params.get('borrower')
        if not borrower_id or int(borrower_id) < 0:
            return redirect_to(controller='borrow', action='add_borrower')
            
        record = model.BorrowAct()
        record.media_id = request.params.get('media_id')
        record.borrower_id = borrower_id
        record.borrowed_ts = datetime.now()
        meta.Session.save(record)
        meta.Session.commit()

        h.flash("added: %s" % record)
        return redirect_to(controller='borrow', action='index')
        
    def add_borrower(self):
        c.item = model.Borrower()
        c.action = "Add"
        c.post_action = "add_borrower_post"
        return render('borrow/add_borrower.mako')
        
    def add_borrower_post(self):
        record = model.Borrower()
        record.first_name = request.params.get('first_name')
        record.last_name = request.params.get('last_name')
        record.email = request.params.get('email')
        record.created_ts = datetime.now()
        record.updated_ts = datetime.now()
        meta.Session.save(record)
        meta.Session.commit()

        h.flash("added: %s" % record)
        return redirect_to(controller='borrow', action='list_borrowers')

    def list_borrowers(self, page=1):
        query = meta.Session\
            .query(model.Borrower)\
            .order_by(model.Borrower.id.desc())

        #~ c.items = query.all()
        c.page = paginate.Page(query, page)
        c.title = "All borrowers"
        #~ c.pager_action = "list_no_image"
        return render('borrow/list_borrowers.mako')
    
    def edit_borrower(self, id):
        c.item = meta.find(model.Borrower, id)
        c.action = "Edit"
        return render('borrow/edit_borrower.mako')
        
    def edit_borrower_post(self, id):
        record = meta.find(model.Borrower, id)
        record.first_name = request.params.get('first_name')
        record.last_name = request.params.get('last_name')
        record.email = request.params.get('email')
        record.updated_ts = datetime.now()
        meta.Session.update(record)
        meta.Session.commit()

        h.flash("updated: %s" % record)
        return redirect_to(controller='borrow', action='edit_borrower', id=id)
