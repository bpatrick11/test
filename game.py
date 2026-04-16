# class Producer:
#     def __init__(self, owned, price, production):
#         self.owned = owned
#         self.price = price
#         self.production = production

#     def purchase(self):
#         global currency
#         global currencypersecond

#         if currency >= self.price:
#             currency -= self.price
#             self.owned += 1

#             # Increase CPS
#             currencypersecond += self.production

#             # Increase price for next purchase
#             self.price = self.price * 3

#         return currency

#     def get_price(self):
#         return self.price


# currency = 0
# currencypersecond = 1

# producer1 = Producer(0, 10, 3)


# def increment():
#     global currency
#     currency += 1
#     return currency

# def second():
#     global currency
#     currency += currencypersecond
#     return currency

# def CPS():
#     return currencypersecond

# def buy_producer():
#     return producer1.purchase()

# def producer_price():
#     return producer1.get_price()


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


# --- GAME STATE ---
currency = 0
currencypersecond = 1

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
    currency += 1
    return currency

def second():
    global currency
    currency += currencypersecond
    return currency

def CPS():
    return currencypersecond

def buy_producer(index):
    return producers[index].purchase()

def get_price(index):
    return producers[index].price

def get_owned(index):
    return producers[index].owned

