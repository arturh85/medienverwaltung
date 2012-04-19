import amazonproduct
from pylons import config, url

def searchAmazon(query, search_index, page=1):
    api = amazonproduct.API(config['Amazon.AccessKeyID'],
        config['Amazon.SecretAccessKey'],
        config['Amazon.Locale'],
        config['Amazon.AssociateTag'])

    node = api.item_search(search_index,
        Title=query.encode('utf-8'),
        ResponseGroup="Images,ItemAttributes",
        ItemPage=page)

    for page in node:
        return page.Items.Item

