## -*- coding: utf-8 -*-
##<%def name="link_to_borrower(item, h)" filter="n">
<%! from pylons import tmpl_context as c %>

<%def name="link_to_borrower(item, h)">
<a href="${h.url_for(controller='borrow', action='edit_borrower', id=item.id, mobile=c.mobile)}">
${item.first_name} ${item.last_name}</a>
</%def>
