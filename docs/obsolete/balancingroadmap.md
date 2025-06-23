Since this game already reaches v1.0.0, this is an **OBSOLETE DOCUMENT**.

## Balancing Guide

This is a guide on how to balance your quest rewards. It is a very simple mathematics.

### Reward Formula

The main reward formula is based on a metric called the "money-per-slaver-week".
This is roughly how much gold a slaver contributes each week.
This value is stored in setup.MONEY_PER_SLAVER_WEEK, and at the time of the writing
of this document, this value is 500.
This means that roughly speaking, each slaver in your company makes you 500g each week.
For example, if you have 10 slavers, you get 5000g profit per week.

How does this translate to rewards? A quest that takes 1 week and involve 3 slaver should
then give an equivalent of 1500g. Similarly, a quest that takes 3 weeks and involve
3 slaver and 1 slave should give 3 * 2000g (the slave counts towards the 500g).

Critical reward is basically doubled the normal reward.

By default, the Money given in the content creator if you put 0 will
be 3 * (number of weeks).
If you want to halve the reward, put 0.5 instead of 0.
If you want to double it, put 2.0 instead of 0.

### Non-money rewards

All non-money rewards should be converted to money.
A normal slave is worth 1500g --- hence, a one week quest involving 3 slavers can give a slave,
but then should not give any extra money.
An equipment is worth 1000g --- you can give two for a one week quest since equipment is only
sellable at half price.
The list of conversions are:

- normal slave: 1500g

- free slaver: 1500g

- mercenary (paid slaver): 1500g for 4 normal-quality mercenaries

- training slave: should give roughly 1000g worth of slave value per week of training

- equipment: standard equipment is 1000g, good equipment is 5000g.

- relationship does not count towards this. However, a general guideline is that loss
should be twice the gain. Gain should be 2 at critical, 1 at normal. Loss is double that.
This is because loss can be mitigated while gain can be boosted by duties.

### Slave Order

Slave order value is slightly complicated, but it should still follow the formula.
The quest that obtains the slave order should be counted towards the total value.
For example, for a fixed price slave order, if it is obtained via a 2 weeks quest that
gives a slave order and nothing else, then the slave order should have a value of
2 * 3 * 500g (for the quest), and then plus another 1500g (default value of a slave),
for a total of 4500g.

### Lower level income

At difficulty level less than 40, all income are reduced.
Once the difficulty hit 40, the income "stabilizes" --- it no longer scale with level.

