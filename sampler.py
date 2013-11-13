from utils import chunks
import random

class Sampler(object):
    def __init__(self, wordfile='static/data/words.txt', levels=50):
        with open(wordfile) as fil:
            self.words = [l.strip().lower() for l in fil.readlines()]
            self.words = [w for w in self.words if len(w) >= 3]

        random.shuffle(self.words)
        self.words = sorted(self.words, key=len)
        self.words = list(chunks(self.words, levels))

    def sample(self, level, num=0):
        """Return a sample of words from a specified level.

        Args:
            level: difficulty level of the word
            num: number of words to return
        """
        level = min(level, len(self.words) - 1)
        num = min(num, len(self.words[level]) - 1)

        if num == 1:
            return random.choice(self.words[level])
        return random.sample(self.words[level], num)
