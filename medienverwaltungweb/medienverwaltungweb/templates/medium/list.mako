## -*- coding: utf-8 -*-
<%inherit file="/layout-default.mako"/>\

<%def name="title()">${c.title}</%def>

<%def name="content()">
<%namespace name='medium_block' file='medium_block.mako' />
<%namespace name='js_pager' file='../js_pager.mako' />
${js_pager.js_pager(e)}
${self.bare_content(c.page, c.pager_action)}

</%def>

<%def name="bare_content(pager, pager_action)">

Sort by:
<a href="${h.url_for(order=h.iif(c.order=='created_ts', 'created_ts_desc', 'created_ts'))}">${_('created_ts')}</a>
<a href="${h.url_for(order=h.iif(c.order=='updated_ts', 'updated_ts_desc', 'updated_ts'))}">${_('updated_ts')}</a>

<p>${pager.pager(controller='medium', action=pager_action)}</p>

<form id="signin-form" method="post" action="${h.url_for(controller='medium', action='delete', page=None)}">
<table border=1 class='simple'>
    <tr>
        <td class='simple'>&nbsp;</td>
        <td class='simple'><a href="${h.url_for(order=h.iif(c.order=='id', 'id_desc', 'id'))}">${_('Id')}</a></td>
        <td class='simple'><a href="${h.url_for(order=h.iif(c.order=='title', 'title_desc', 'title'))}">${_('Title')}</a></td>
##        <td class='simple'>${_('Tags')}</td>
    </tr>

    % for item in pager.items:
    <tr>
        <td class='simple'>
            <input type="checkbox" name="item_id_${item.id}" value="${item.id}">
            <a href="${h.url_for(controller='medium', action='edit', id=item.id, page=None, type=None, tag=None)}">Edit</a>
        </td>
        <td class='simple'>${item.id}</td>
        <td class='simple' width="100%">
            ${medium_block.medium_block(item)}
        </td>
##        <td class='simple'>
##            % for subitem in item.tags:
##            <a href="${h.url_for(controller='medium', action='list', tag=subitem.name, page=None)}">
##                ${subitem.name}
##            </a>
##            % endfor
##        </td>
    </tr>
    %endfor
</table>

<p>${pager.pager(controller='medium', action=pager_action)}</p>

<p>
<input type="submit" value="Delete marked Media"/>
##<a href="${h.url_for(action='delete', id=None)}">Delete marked Media</a>
</p>
</form>

</%def>
