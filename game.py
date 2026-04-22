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
        self.drainDebuff = debuff  # e.g. 0.5 = 50%

    def stop_drain(self):
        self.drainActive = False
        self.nextDrainTimerSec = self.timeS

    def drain_increment_sec(self):
        if self.drainActive:
            return  # do nothing while active

        self.nextDrainTimerSec -= 1

        if self.nextDrainTimerSec <= 0:
            self.drainActive = True

    def get_multiplier(self):
        if self.drainActive:
            return self.drainDebuff
        return 1


# --- GAME STATE ---
currency = 0 # total currency
currencypersecond = 1 # currency added tot total per second
minigameactive = False # if the drain minigame is active
# should the minigame var be here or in the drain class??

drain = Drain(0.25, 0.5)  # activates every 15s, cuts CPS in half

# Create 5 producers
producers = [
    Producer(10, 3),     # Producer 1
    Producer(500, 10),   # Producer 2
    Producer(2500, 25),  # Producer 3
    Producer(10000, 100),# Producer 4
    Producer(50000, 300) # Producer 5
]


# --- FUNCTIONS FOR JS ---
def increment():
    global currency
    global currencypersecond

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
