import requests
import json
from bs4 import BeautifulSoup

def feed_url(feed="top_favorites", format="json"):
    return "http://gdata.youtube.com/feeds/api/standardfeeds/%s?alt=%s&orderby=published&time=this_week" % (feed, format)

def comments_feed_url(vid):
    return "https://gdata.youtube.com/feeds/api/videos/%s/comments?orderby=published" % vid

def get_feed(url, is_json=True):
    r = requests.get(url)
    if is_json:
        data = json.loads(r.text)
    else:
        data = r.text
    return data

if __name__ == '__main__':
    feed = get_feed(feed_url())
    for entry in feed["feed"]["entry"]:
        #print json.dumps(entry, sort_keys=True, indent=4, separators=(',', ': '))
        focus_id = entry["id"]["$t"]
        vid = focus_id.split("http://gdata.youtube.com/feeds/api/videos/")[1]

        comments_soup = BeautifulSoup(get_feed(comments_feed_url(vid), False))
        comments = comments_soup.find_all("entry")
        for c in comments:
            body = c.content.text
            created_at = c.published.text
            u = c.author.find("name").text

            print created_at
            print "%s: %s (%s)\n" % (vid, body, u)
