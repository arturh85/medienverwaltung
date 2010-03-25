<%inherit file="/layout-default.mako"/>\

<%def name="title()">Item Search Results</%def>

<%def name="content()">
<form id="signin-form" method="post" action="${h.url_for(action='map_to_medium_post')}">
<table border=1 class='simple'>
    <tr>
        <td class='simple'>&nbsp;</td>
        <td class='simple'>${_('ASIN')}</td>
        <td class='simple'>${_('Title')}</td>
        <td class='simple'>${_('Image')}</td>
        <td class='simple'>${_('Actions')}</td>
    </tr>

    % for item in c.items:
    <tr>
        <td class='simple'>
            <input type="checkbox" name="item_id_${item.ASIN}" value="${item.ASIN}">
        </td>
        <td class='simple'>${item.ASIN}</td>
        <td class='simple'>${unicode(item.ItemAttributes.Title)}</td>
        %if 'SmallImage' in dir(item):
        <td class='simple'><img src="${unicode(item.SmallImage.URL)}" /></td>
        %else:
        <td class='simple'>No image available</td>
        %endif
        <td class='simple'><a href="${h.url_for(action='add_asin', id=item.ASIN)}">Add this to db</a></td>
    </tr>
    %endfor
</table>
<input type="hidden" name="media_id" value="${c.item.id}" />
<input type="submit" value="Attach to '${c.item}'"/>
</form>
</%def>