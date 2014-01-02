from itertools import izip_longest, takewhile

import jinja2
import os

def chunks(lst, num):
    """Split an iterable into n evenly sized chunks with the possible
    exception of the last.

    Args:
        iterable: any object which is iterable
        n: size of each chunk

    Returns:
        A list of iterables, each iterable having length n (except maybe the
        last)
    """
    next_n = int(len(lst) / num)
    for i in xrange(num - 1):
        yield lst[i * next_n : (i + 1) * next_n]
    yield lst[(num - 1) * next_n:]

def render_template(template_path, values={}):
    template = get_template(template_path);
    return template.render(values)

def get_template(name):
    jinja_environment = jinja2.Environment(
        loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))
    return jinja_environment.get_template(name);
