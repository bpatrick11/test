class Producer: 
    def __init__(self, price, production):
        self.owned = 0
        self.price = price
        self.production = production

    def purchase(self):
        global currency
        global currencypersecond

        if currency >= self.price:
            currency -= self.price
            self.owned += 1

            # Add CPS
            currencypersecond += self.production

            # Scale cost
            self.price *= 3

        return currency


class Drain:
    def __init__(self, timeM, debuff):
        self.timeS = timeM * 60
        self.nextDrainTimerSec = self.timeS
        self.drainActive = False
        self.drainDebuff = debuff

    def stop_drain(self):
        self.drainActive = False
        self.nextDrainTimerSec = self.timeS

    def drain_increment_sec(self):
        if self.drainActive:
            return

        self.nextDrainTimerSec -= 1

        if self.nextDrainTimerSec <= 0:
            self.drainActive = True

    def get_multiplier(self):
        if self.drainActive:
            return self.drainDebuff
        return 1
        
    def get_drain_multiplier():
        return drain.get_multiplier()

# --- GAME STATE ---
currency = 0
currencypersecond = 1

# Drain (every 15 sec, 50% debuff)
drain = Drain(0.25, 0.5)

# Producers (same as your working version)
producers = [
    Producer(10, 3),
    Producer(500, 10),
    Producer(2500, 25),
    Producer(10000, 100),
    Producer(50000, 300)
]


# --- FUNCTIONS FOR JS ---
def increment():
    global currency
    currency += currencypersecond
    return currency


def second():
    global currency

    drain.drain_increment_sec()
    multiplier = drain.get_multiplier()

    currency += currencypersecond * multiplier
    return currency


def CPS():
    return currencypersecond


def buy_producer(index):
    return producers[index].purchase()


def get_price(index):
    return producers[index].price


def get_owned(index):
    return producers[index].owned


def get_production(index):
    return producers[index].production


def is_drain_active():
    return drain.drainActive


def stop_drain():
    drain.stop_drain()
    return currency
