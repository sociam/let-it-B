import requests
import json
from bs4 import BeautifulSoup

# Fixed no of comments from top 10 (?) favorited video.
# TODO: Add many video feeds, make realtime update..

def feed_url(chart="mostPopular", time="today", page=None):
    url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=%s&time=%s&key=AIzaSyDmAkiAi3s1dd5nHcmKP9ZGlbMvcb_EaWo" % (chart, time)
    if page:
        url = "%s&pageToken=%s" % (url, page)
    return url

def comments_feed_url(vid):
    return "https://gdata.youtube.com/feeds/api/videos/%s/comments?orderby=published" % vid

def get_feed():
    vids = {}
    page = None
    done = False
    while not done:
        five_vids = get_feed_batch(feed_url(page=page))
        try:
            page = five_vids["nextPageToken"]
        except KeyError:
            done = True
        else:
            for vid in five_vids["items"]:
                vids[vid["id"]] = {"category": vid["snippet"]["categoryId"],
                                    "title": vid["snippet"]["title"],
                                    "published": vid["snippet"]["publishedAt"]
                                    }
    return vids

def get_feed_batch(url, is_json=True):
    r = requests.get(url)
    if is_json:
        data = json.loads(r.text)
    else:
        data = r.text
    return data

def get_comments(vid):
    url = comments_feed_url(vid)
    print url
    done = False
    comments = {}
    #while not done:
        #soup = BeautifulSoup(get_feed_batch(url, False))

if __name__ == '__main__':
    feed = get_feed()
    #print json.dumps(feed, sort_keys=True, indent=4, separators=(',', ': '))
    for vid in feed:
        print get_comments(vid)
    """for entry in feed["feed"]["entry"]:
        
        focus_id = entry["id"]["$t"]
        vid = focus_id.split("http://gdata.youtube.com/feeds/api/videos/")[1]

        comments_soup = BeautifulSoup(get_feed(comments_feed_url(vid), False))
        comments = comments_soup.find_all("entry")
        for c in comments:
            body = c.content.text
            created_at = c.published.text
            u = c.author.find("name").text

            print created_at
            print "%s: %s (%s)\n" % (vid, body, u)"""
