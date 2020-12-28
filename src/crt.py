# A Python 3program to demonstrate
# working of Chinise remainder
# Theorem

# Returns modulo inverse of a with
# respect to m using extended
# Euclid Algorithm. Refer below
# post for details:
# https://www.geeksforgeeks.org/multiplicative-inverse-under-modulo-m/
def inv(a, m):

    m0 = m
    x0 = 0
    x1 = 1

    if m == 1:
        return 0

    # Apply extended Euclid Algorithm
    while a > 1:
        # q is quotient
        q = a // m

        t = m

        # m is remainder now, process
        # same as euclid's algo
        m = a % m
        a = t

        t = x0

        x0 = x1 - q * x0

        x1 = t

    # Make x1 positive
    if x1 < 0:
        x1 = x1 + m0

    return x1


# k is size of num[] and rem[].
# Returns the smallest
# number x such that:
# x % num[0] = rem[0],
# x % num[1] = rem[1],
# ..................
# x % num[k-2] = rem[k-1]
# Assumption: Numbers in num[]
# are pairwise coprime
# (gcd for every pair is 1)
def findMinX(num, rem, k):

    # Compute product of all numbers
    prod = 1
    for i in range(0, k):
        prod = prod * num[i]

    # Initialize result
    result = 0

    # Apply above formula
    for i in range(0, k):
        pp = prod // num[i]
        result = result + rem[i] * inv(pp, num[i]) * pp
    return result % prod


# Driver method
ls = [
    [0, 23],
    [13, 41],
    [23, 509],
    [36, 13],
    [37, 17],
    [52, 29],
    [54, 401],
    [60, 37],
    [73, 19],
]
# ls = [
#     [3, 2],
#     [5, 3],
#     [7, 2],
# ]


num = [i[1] for i in ls]
# rem = [i[0] for i in ls]
rem = [i[1] - i[0] for i in ls]
print(rem)
rem[0] = 0
k = len(num)
print("x is ", findMinX(num, rem, k))

# This code is contributed by Nikita Tiwari.
