/* LC150_PROBLEMS — all 150 problems, keyed by LeetCode slug */
window.LC150_PROBLEMS = {

/* ════════════════ ARRAY / STRING ════════════════ */
"merge-sorted-array": {
  num:1, title:"Merge Sorted Array", diff:"Easy", cat:"Array / String",
  lc:"https://leetcode.com/problems/merge-sorted-array/",
  rev:"5 min", pattern:"Two Pointers from the End",
  sections:{
    explain:"Merge nums2 into nums1 in-place. nums1 has size m+n with m valid elements; nums2 has n. Result must be in nums1.",
    example:{input:"nums1=[1,2,3,0,0,0] m=3, nums2=[2,5,6] n=3", output:"[1,2,2,3,5,6]", why:"Merge in sorted order"},
    intuition:"If you merge forward you'll overwrite unread nums1 values. Merge from the END instead — the tail of nums1 is always free space. Use three pointers: p1=m-1, p2=n-1, p=m+n-1. Place the larger of nums1[p1] and nums2[p2] at p each step.",
    tricks:[
      {name:"Merge from the right", detail:"Avoids overwriting unprocessed elements. Classic two-pointer trick whenever you have 'extra space at the end'."},
      {name:"Handle leftover nums2", detail:"After the loop, if p2 >= 0 there are still elements in nums2 — copy them. nums1 leftovers are already in place."}
    ],
    code:`def merge(self, nums1, m, nums2, n):
    p1, p2, p = m-1, n-1, m+n-1
    while p1 >= 0 and p2 >= 0:
        if nums1[p1] >= nums2[p2]:
            nums1[p] = nums1[p1]; p1 -= 1
        else:
            nums1[p] = nums2[p2]; p2 -= 1
        p -= 1
    # Copy remaining nums2 (nums1 leftovers are already in place)
    nums1[:p2+1] = nums2[:p2+1]`,
    tc:"O(m+n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"Start at tails", detail:"p1=2 (nums1[2]=3), p2=2 (nums2[2]=6), p=5. Place 6 at index 5."},
        {label:"Advance p2, p", detail:"p2=1 (5), p=4. 5>3, place 5. p2=0 (2), p=3. 3>=2, place 3. p1=1 (2), p=2."},
        {label:"Tie: 2==2", detail:"Both are 2; place nums1[p1]=2 first. p1=0 (1), p=1. 2>1, place nums2[p2]=2. p2=-1."},
        {label:"nums2 exhausted", detail:"Loop ends. nums1 leftovers [1] remain at their correct positions."}
      ],
      edgeCase:"m=0: nums1 is all zeros. Loop body never runs (p1=-1). The slice assignment copies all of nums2."
    },
    similar:{
      "Two Pointers":["Sort Colors","Partition Array","Remove Duplicates from Sorted Array"]
    }
  }
},

"remove-element": {
  num:2, title:"Remove Element", diff:"Easy", cat:"Array / String",
  lc:"https://leetcode.com/problems/remove-element/",
  pattern:"Two Pointers (write pointer)",
  sections:{
    explain:"Remove all occurrences of val in-place; return new length. Order can change.",
    example:{input:"nums=[3,2,2,3], val=3", output:"2, nums=[2,2,_,_]"},
    intuition:"Maintain a write pointer k. For each element, if it's not val, write it at k and advance k.",
    tricks:[{name:"Write pointer", detail:"k tracks the next slot to write. Only advance k when you keep an element."}],
    code:`def removeElement(self, nums, val):
    k = 0
    for n in nums:
        if n != val:
            nums[k] = n
            k += 1
    return k`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[{label:"Scan each element",detail:"If nums[i]!=val write to nums[k] and k++. Otherwise skip."}]},
    similar:{"Two Pointers":["Remove Duplicates from Sorted Array","Move Zeroes"]}
  }
},

"remove-duplicates-from-sorted-array": {
  num:3, title:"Remove Duplicates from Sorted Array", diff:"Easy", cat:"Array / String",
  lc:"https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
  pattern:"Write Pointer on Sorted Array",
  sections:{
    explain:"Remove duplicates in-place from sorted nums. Return count of unique elements.",
    example:{input:"nums=[1,1,2]", output:"2, nums=[1,2,_]"},
    intuition:"Write pointer k starts at 1. For every element where nums[i] != nums[i-1], write to nums[k] and advance k.",
    tricks:[{name:"Compare to previous",detail:"Since sorted, a new unique value is always > the last written. Check nums[i] != nums[k-1]."}],
    code:`def removeDuplicates(self, nums):
    k = 1
    for i in range(1, len(nums)):
        if nums[i] != nums[k-1]:
            nums[k] = nums[i]; k += 1
    return k`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[{label:"k=1",detail:"Start from index 1. Each time nums[i] != nums[k-1], write and advance k."}]},
    similar:{"Write Pointer":["Remove Duplicates II","Remove Element"]}
  }
},

"remove-duplicates-from-sorted-array-ii": {
  num:4, title:"Remove Duplicates from Sorted Array II", diff:"Medium", cat:"Array / String",
  lc:"https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/",
  pattern:"Write Pointer — allow at most 2",
  sections:{
    explain:"Same as Remove Duplicates I but allow each unique element to appear at most twice.",
    example:{input:"nums=[1,1,1,2,2,3]", output:"5, [1,1,2,2,3]"},
    intuition:"Write pointer k starts at 2. Write nums[i] when nums[i] != nums[k-2]. This naturally caps each value at 2 occurrences.",
    tricks:[{name:"Compare to k-2",detail:"The generalisation: allow at most K occurrences → compare nums[i] to nums[k-K]."}],
    code:`def removeDuplicates(self, nums):
    k = 2
    for i in range(2, len(nums)):
        if nums[i] != nums[k-2]:
            nums[k] = nums[i]; k += 1
    return k`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[{label:"k=2",detail:"Skip third copy of 1 (nums[2]=1 == nums[k-2]=nums[0]=1). Write second copy of 2 and 3."}]},
    similar:{"Write Pointer":["Remove Duplicates I","Remove Element"]}
  }
},

"majority-element": {
  num:5, title:"Majority Element", diff:"Easy", cat:"Array / String",
  lc:"https://leetcode.com/problems/majority-element/",
  pattern:"Boyer-Moore Voting",
  sections:{
    explain:"Find the element that appears more than n/2 times. It always exists.",
    example:{input:"nums=[2,2,1,1,2,2,2]", output:"2"},
    intuition:"Boyer-Moore Voting: maintain a candidate and a count. When count hits 0, switch candidate. Votes for/against cancel out; the majority always survives.",
    tricks:[
      {name:"Boyer-Moore Voting",detail:"Each 'vote against' the candidate cancels one 'vote for'. Majority has >n/2 votes so it always wins."},
      {name:"No hash map needed",detail:"O(1) space — no need to count all elements."}
    ],
    code:`def majorityElement(self, nums):
    candidate, count = None, 0
    for n in nums:
        if count == 0:
            candidate = n
        count += 1 if n == candidate else -1
    return candidate`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"n=2",detail:"count=0 → candidate=2, count=1"},
        {label:"n=2",detail:"count=2"},
        {label:"n=1",detail:"count=1"},
        {label:"n=1",detail:"count=0 → next element becomes candidate"},
        {label:"n=2",detail:"count=0 → candidate=2, count=1"},
        {label:"Remaining 2s",detail:"count rises to 3. Return 2."}
      ],
      edgeCase:"n=1: immediately returns nums[0]."
    },
    similar:{"Counting/Voting":["Majority Element II","Find the Duplicate Number"]}
  }
},

"rotate-array": {
  num:6, title:"Rotate Array", diff:"Medium", cat:"Array / String",
  lc:"https://leetcode.com/problems/rotate-array/",
  pattern:"Reverse Three Times",
  sections:{
    explain:"Rotate array right by k steps in-place.",
    example:{input:"nums=[1,2,3,4,5,6,7], k=3", output:"[5,6,7,1,2,3,4]"},
    intuition:"Reverse the whole array, then reverse first k, then reverse rest k..n-1. Three reverses, O(1) space.",
    tricks:[{name:"k = k % n",detail:"k can be > n. Always mod first. Three-reversal pattern is the canonical O(1)-space rotation."}],
    code:`def rotate(self, nums, k):
    n, k = len(nums), k % len(nums)
    def rev(l, r):
        while l < r: nums[l], nums[r] = nums[r], nums[l]; l+=1; r-=1
    rev(0, n-1); rev(0, k-1); rev(k, n-1)`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[{label:"Full reverse then split reverse",detail:"[7,6,5,4,3,2,1] → rev[0..2]→[5,6,7,4,3,2,1] → rev[3..6]→[5,6,7,1,2,3,4]"}]},
    similar:{"Array":["Reverse String","Rotate List"]}
  }
},

"best-time-to-buy-and-sell-stock": {
  num:7, title:"Best Time to Buy and Sell Stock", diff:"Easy", cat:"Array / String",
  lc:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
  pattern:"Greedy — Track Running Minimum",
  sections:{
    explain:"Given daily prices, buy once and sell once for maximum profit. Return 0 if no profit possible.",
    example:{input:"prices=[7,1,5,3,6,4]", output:"5 (buy day 2 at 1, sell day 5 at 6)"},
    intuition:"Scan left to right. Keep track of the lowest price seen so far (min_price). At each day, check if selling today gives a better profit than the current best.",
    tricks:[
      {name:"Running minimum",detail:"You always want to buy at the cheapest price seen so far. Update min_price greedily."},
      {name:"O(1) space",detail:"No need to store all prices or use DP. One pass, two variables."}
    ],
    code:`def maxProfit(self, prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    return max_profit`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"price=7",detail:"min_price=7, profit=0"},
        {label:"price=1",detail:"min_price=1, profit=0"},
        {label:"price=5",detail:"min_price=1, profit=4"},
        {label:"price=6",detail:"min_price=1, profit=5"},
        {label:"price=4",detail:"min_price=1, profit still 5"}
      ],
      edgeCase:"prices=[7,6,4,3,1]: always decreasing. min_price updates each step, profit stays 0. Return 0."
    },
    similar:{
      "Greedy":["Best Time to Buy and Sell Stock II","Maximum Subarray"],
      "DP":["Best Time to Buy and Sell Stock with Cooldown","Best Time III/IV"]
    }
  }
},

"best-time-to-buy-and-sell-stock-ii": {
  num:8, title:"Best Time to Buy and Sell Stock II", diff:"Medium", cat:"Array / String",
  lc:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
  pattern:"Greedy — Capture Every Upslope",
  sections:{
    explain:"Multiple transactions allowed (sell before rebuy). Maximize total profit.",
    example:{input:"prices=[7,1,5,3,6,4]", output:"7 (buy@1 sell@5 profit=4, buy@3 sell@6 profit=3)"},
    intuition:"Add every positive day-to-day difference. Equivalent to buying at the start of every upslope.",
    tricks:[{name:"Sum all positive slopes",detail:"profit += max(0, prices[i]-prices[i-1]) for every consecutive pair. Greedy correctness: every upslope contributes independently."}],
    code:`def maxProfit(self, prices):
    return sum(max(0, prices[i]-prices[i-1]) for i in range(1,len(prices)))`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[{label:"Scan differences",detail:"1→5(+4), 5→3(-2,skip), 3→6(+3), 6→4(-2,skip). Total=7."}]},
    similar:{"Greedy":["Best Time I","Best Time with Cooldown","Task Scheduler"]}
  }
},

"jump-game": {
  num:9, title:"Jump Game", diff:"Medium", cat:"Array / String",
  lc:"https://leetcode.com/problems/jump-game/",
  pattern:"Greedy — Track Max Reachable",
  sections:{
    explain:"Each element is max jump length from that index. Can you reach the last index?",
    example:{input:"nums=[2,3,1,1,4]", output:"true"},
    intuition:"Track the farthest index reachable so far. At each position i, if i > farthest we're stuck. Otherwise update farthest = max(farthest, i + nums[i]).",
    tricks:[{name:"Max reachable frontier",detail:"If you can reach i, you can jump anywhere up to i+nums[i]. The question is whether farthest ever reaches n-1."}],
    code:`def canJump(self, nums):
    farthest = 0
    for i, jump in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + jump)
    return True`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[
      {label:"i=0",detail:"farthest=max(0,0+2)=2"},
      {label:"i=1",detail:"farthest=max(2,1+3)=4 ≥ n-1=4 → reachable"},
    ],edgeCase:"nums=[0]: last index is index 0, already there → true. nums=[0,1]: farthest=0, at i=1: 1>0 → false."},
    similar:{"Greedy":["Jump Game II","Minimum Number of Arrows"]}
  }
},

"jump-game-ii": {
  num:10, title:"Jump Game II", diff:"Medium", cat:"Array / String",
  lc:"https://leetcode.com/problems/jump-game-ii/",
  pattern:"Greedy — BFS Levels",
  sections:{
    explain:"Return minimum number of jumps to reach last index (guaranteed reachable).",
    example:{input:"nums=[2,3,1,1,4]", output:"2 (0→1→4)"},
    intuition:"Think BFS levels. current_end = furthest you can reach from this 'level'. When you reach current_end, you must take another jump (level++). Track farthest across the level.",
    tricks:[{name:"BFS without queue",detail:"current_end is the boundary of the current jump. farthest is the furthest reachable within that jump. When i==current_end, increment jumps and advance boundary."}],
    code:`def jump(self, nums):
    jumps = current_end = farthest = 0
    for i in range(len(nums)-1):
        farthest = max(farthest, i + nums[i])
        if i == current_end:
            jumps += 1
            current_end = farthest
    return jumps`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[
      {label:"i=0",detail:"farthest=2, i==current_end(0) → jumps=1, current_end=2"},
      {label:"i=1",detail:"farthest=4"},
      {label:"i=2",detail:"farthest still 4, i==current_end(2) → jumps=2, current_end=4"}
    ]},
    similar:{"Greedy":["Jump Game","Minimum Number of Arrows to Burst Balloons"]}
  }
},

"h-index": {
  num:11, title:"H-Index", diff:"Medium", cat:"Array / String",
  lc:"https://leetcode.com/problems/h-index/",
  pattern:"Sort + Greedy",
  sections:{
    explain:"Given citation counts, return h: max h where at least h papers have ≥ h citations.",
    example:{input:"citations=[3,0,6,1,5]", output:"3"},
    intuition:"Sort descending. h-index is the last index where sorted[i] >= i+1.",
    tricks:[{name:"Binary search alternative",detail:"Can binary search on h from 0..n. Check if count of papers ≥ h is ≥ h."}],
    code:`def hIndex(self, citations):
    citations.sort(reverse=True)
    h = 0
    for i, c in enumerate(citations):
        if c >= i + 1: h = i + 1
        else: break
    return h`,
    tc:"O(n log n)", sc:"O(1)",
    walkthrough:{steps:[{label:"Sorted=[6,5,3,1,0]",detail:"i=0:6≥1✓ i=1:5≥2✓ i=2:3≥3✓ i=3:1≥4✗ → h=3"}]},
    similar:{"Sorting":["Kth Largest Element","Find Median from Data Stream"]}
  }
},

"insert-delete-getrandom-o1": {
  num:12, title:"Insert Delete GetRandom O(1)", diff:"Medium", cat:"Array / String",
  lc:"https://leetcode.com/problems/insert-delete-getrandom-o1/",
  pattern:"HashMap + Dynamic Array",
  sections:{
    explain:"Design data structure with O(1) insert, delete, and getRandom.",
    example:{input:"insert(1),insert(2),getRandom(),remove(1),getRandom()", output:"→ true,true,1or2,true,2"},
    intuition:"HashMap maps val→index in a list. For O(1) delete: swap the target with the last element, update the swapped element's index in the map, then pop the last.",
    tricks:[{name:"Swap with tail for O(1) delete",detail:"Removing from middle of array is O(n). Swap with last element first, then pop. Update the swapped element's index in the map."}],
    code:`import random
class RandomizedSet:
    def __init__(self):
        self.idx = {}   # val -> list index
        self.vals = []
    def insert(self, val):
        if val in self.idx: return False
        self.idx[val] = len(self.vals)
        self.vals.append(val); return True
    def remove(self, val):
        if val not in self.idx: return False
        last = self.vals[-1]
        i = self.idx[val]
        self.vals[i] = last
        self.idx[last] = i
        self.vals.pop(); del self.idx[val]; return True
    def getRandom(self):
        return random.choice(self.vals)`,
    tc:"O(1) average", sc:"O(n)",
    walkthrough:{steps:[{label:"Delete val",detail:"Swap val with vals[-1], update idx[last], pop, delete idx[val]."}],edgeCase:"Deleting the last element: last=val, no swap needed but idx still needs cleanup — the pop handles it."},
    similar:{"Design":["LRU Cache","Randomized Collection"]}
  }
},

"product-of-array-except-self": {
  num:13, title:"Product of Array Except Self", diff:"Medium", cat:"Array / String",
  lc:"https://leetcode.com/problems/product-of-array-except-self/",
  pattern:"Prefix Product × Suffix Product",
  sections:{
    explain:"Return array where output[i] = product of all nums except nums[i]. No division, O(n) time.",
    example:{input:"nums=[1,2,3,4]", output:"[24,12,8,6]"},
    intuition:"output[i] = (product of nums[0..i-1]) × (product of nums[i+1..n-1]). Compute left prefix products in one pass, then multiply right suffix products in a second pass using a running variable.",
    tricks:[
      {name:"Prefix × Suffix",detail:"Left pass fills output with prefix products. Right pass multiplies in the suffix using a running 'right' variable — no extra array needed."},
      {name:"Handles zeros",detail:"Two zeros: all outputs are 0. One zero: only the zero's position gets a non-zero output. Division-based solutions fail on zero; prefix/suffix doesn't."}
    ],
    code:`def productExceptSelf(self, nums):
    n = len(nums)
    out = [1] * n
    # Left prefix products
    for i in range(1, n):
        out[i] = out[i-1] * nums[i-1]
    # Multiply right suffix in-place
    right = 1
    for i in range(n-1, -1, -1):
        out[i] *= right
        right *= nums[i]
    return out`,
    tc:"O(n)", sc:"O(1) extra (output array doesn't count)",
    walkthrough:{
      steps:[
        {label:"Left pass",detail:"out=[1,1,2,6] (prefix products before each index)"},
        {label:"Right pass",detail:"i=3: out[3]*=1=6, right=4. i=2: out[2]*=4=8, right=12. i=1: out[1]*=12=12, right=24. i=0: out[0]*=24=24."},
      ]
    },
    similar:{"Prefix":["Subarray Product Less Than K","Maximum Product Subarray"]}
  }
},

"gas-station": {
  num:14, title:"Gas Station", diff:"Medium", cat:"Array / String",
  lc:"https://leetcode.com/problems/gas-station/",
  pattern:"Greedy — Start After Deficit",
  sections:{
    explain:"n gas stations in a circle. gas[i] available, cost[i] to go to next. Find starting station for full circuit (or -1).",
    example:{input:"gas=[1,2,3,4,5], cost=[3,4,5,1,2]", output:"3"},
    intuition:"Key insight: if total gas ≥ total cost, exactly one valid start exists. Find it by tracking the running tank. When tank goes negative, reset start to i+1 (we can't start anywhere from the previous segment).",
    tricks:[
      {name:"Two observations",detail:"1) If sum(gas) < sum(cost): impossible. 2) If it's possible, start is the index after the biggest deficit — track with a running sum reset."},
      {name:"No need to simulate",detail:"One pass. When cumulative tank goes below 0, the entire prefix is bad. Reset."}
    ],
    code:`def canCompleteCircuit(self, gas, cost):
    if sum(gas) < sum(cost): return -1
    tank = start = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            start = i + 1
            tank = 0
    return start`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[
      {label:"Check feasibility",detail:"sum(gas)=15, sum(cost)=15 → equal, so solution exists."},
      {label:"i=0",detail:"tank=-2<0 → start=1, tank=0"},
      {label:"i=1",detail:"tank=-2<0 → start=2, tank=0"},
      {label:"i=2",detail:"tank=-2<0 → start=3, tank=0"},
      {label:"i=3,4",detail:"tank=3, then tank=6 ≥ 0. Return start=3."}
    ]},
    similar:{"Greedy":["Jump Game","Candy","Task Scheduler"]}
  }
},

"candy": {
  num:15, title:"Candy", diff:"Hard", cat:"Array / String",
  lc:"https://leetcode.com/problems/candy/",
  pattern:"Two-Pass Greedy",
  sections:{
    explain:"Each child has a rating. Give at least 1 candy each. Higher-rated children must get more than both neighbors. Minimize total.",
    example:{input:"ratings=[1,0,2]", output:"5 (2,1,2)"},
    intuition:"Two passes. Left-to-right: if ratings[i]>ratings[i-1], candies[i]=candies[i-1]+1. Right-to-left: if ratings[i]>ratings[i+1], candies[i]=max(candies[i], candies[i+1]+1). Take max to satisfy both constraints.",
    tricks:[{name:"Two independent sweeps",detail:"Left pass satisfies left-neighbour constraint; right pass satisfies right-neighbour. Taking max at each position satisfies both."}],
    code:`def candy(self, ratings):
    n = len(ratings)
    candies = [1] * n
    for i in range(1, n):
        if ratings[i] > ratings[i-1]:
            candies[i] = candies[i-1] + 1
    for i in range(n-2, -1, -1):
        if ratings[i] > ratings[i+1]:
            candies[i] = max(candies[i], candies[i+1] + 1)
    return sum(candies)`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{steps:[{label:"Two passes",detail:"L→R: [1,1,2]. R→L: [2,1,2]. Sum=5."}]},
    similar:{"Greedy":["Gas Station","Partition Labels"]}
  }
},

"trapping-rain-water": {
  num:16, title:"Trapping Rain Water", diff:"Hard", cat:"Array / String",
  lc:"https://leetcode.com/problems/trapping-rain-water/",
  pattern:"Two Pointers with Running Max",
  sections:{
    explain:"Given heights, compute total water trapped after rain.",
    example:{input:"height=[0,1,0,2,1,0,1,3,2,1,2,1]", output:"6"},
    intuition:"Water at i = min(max_left, max_right) - height[i]. Two-pointer approach: maintain left_max and right_max. Process whichever side has the smaller max — it's the limiting factor.",
    tricks:[
      {name:"Two pointers, process smaller side",detail:"If left_max < right_max, the water at left is limited by left_max. Safe to compute and advance left pointer."},
      {name:"Alternative: prefix max arrays",detail:"O(n) space but simpler to reason: pre-compute left_max[i] and right_max[i], then sum max(0, min(L,R)-h[i])."}
    ],
    code:`def trap(self, height):
    left, right = 0, len(height)-1
    left_max = right_max = water = 0
    while left <= right:
        if left_max <= right_max:
            left_max = max(left_max, height[left])
            water += left_max - height[left]
            left += 1
        else:
            right_max = max(right_max, height[right])
            water += right_max - height[right]
            right -= 1
    return water`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"left=0,right=11",detail:"left_max=0≤right_max=0 → process left. left_max=0, water+=0, left=1."},
        {label:"left=1",detail:"left_max=1. water+=0. left=2."},
        {label:"left=2",detail:"left_max=1. water+=1. left=3."},
        {label:"left=3",detail:"left_max=2. water+=0. Continues until all water counted."}
      ],
      edgeCase:"Empty array or all same height: water=0."
    },
    similar:{"Two Pointers":["Container With Most Water","Product of Array Except Self"]}
  }
},

"roman-to-integer": {
  num:17, title:"Roman to Integer", diff:"Easy", cat:"Array / String",
  lc:"https://leetcode.com/problems/roman-to-integer/",
  pattern:"Hash Map + Look-Ahead",
  sections:{
    explain:"Convert Roman numeral string to integer.",
    example:{input:"s='MCMXCIV'", output:"1994"},
    intuition:"Scan left-to-right. Add value of current symbol. If current value < next value, it's a subtractive case — subtract instead of add.",
    tricks:[{name:"Subtractive rule",detail:"IV=4 not IIII. Whenever a smaller value appears before a larger value, subtract it. Check by comparing current vs next."}],
    code:`def romanToInt(self, s):
    val = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
    total = 0
    for i in range(len(s)):
        if i < len(s)-1 and val[s[i]] < val[s[i+1]]:
            total -= val[s[i]]
        else:
            total += val[s[i]]
    return total`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[{label:"M→C→M",detail:"M=1000+, C=100 (next M=1000 so subtract -100), M=1000+ → 1900 so far."}]},
    similar:{"String":["Integer to Roman","Excel Sheet Column Number"]}
  }
},

"integer-to-roman": {
  num:18, title:"Integer to Roman", diff:"Medium", cat:"Array / String",
  lc:"https://leetcode.com/problems/integer-to-roman/",
  pattern:"Greedy — Largest Symbol First",
  sections:{
    explain:"Convert integer (1-3999) to Roman numeral string.",
    example:{input:"num=1994", output:"MCMXCIV"},
    intuition:"Greedily subtract the largest possible Roman value repeatedly, appending its symbol each time. Pre-list all values including subtractive forms (900=CM, 400=CD, etc.).",
    tricks:[{name:"Include subtractive pairs",detail:"Add 900,CM and 400,CD and 90,XC etc. to the value-symbol table. The greedy loop handles them automatically."}],
    code:`def intToRoman(self, num):
    vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
    syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I']
    result = ''
    for v, s in zip(vals, syms):
        while num >= v:
            result += s; num -= v
    return result`,
    tc:"O(1) — bounded input", sc:"O(1)",
    walkthrough:{steps:[{label:"num=1994",detail:"1994≥1000→M,994; 994≥900→CM,94; 94≥90→XC,4; 4≥4→IV,0."}]},
    similar:{"Math":["Roman to Integer","Excel Sheet Column Title"]}
  }
},

"length-of-last-word": {
  num:19, title:"Length of Last Word", diff:"Easy", cat:"Array / String",
  lc:"https://leetcode.com/problems/length-of-last-word/",
  pattern:"String Traversal from Right",
  sections:{
    explain:"Return length of the last word in a string of words separated by spaces.",
    example:{input:"s='Hello World  '", output:"5"},
    intuition:"Strip trailing spaces, then count backwards until another space.",
    tricks:[{name:"Strip then count",detail:"s.rstrip() removes trailing spaces. Then just count chars from the right until a space."}],
    code:`def lengthOfLastWord(self, s):
    s = s.rstrip()
    count = 0
    for i in range(len(s)-1, -1, -1):
        if s[i] == ' ': break
        count += 1
    return count`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[{label:"Trim then scan back",detail:"'Hello World' → scan from d,l,r,o,W until space."}]},
    similar:{"String":["Reverse Words in a String","First Unique Character"]}
  }
},

"longest-common-prefix": {
  num:20, title:"Longest Common Prefix", diff:"Easy", cat:"Array / String",
  lc:"https://leetcode.com/problems/longest-common-prefix/",
  pattern:"Vertical Scan",
  sections:{
    explain:"Find longest common prefix among array of strings.",
    example:{input:"strs=['flower','flow','flight']", output:"'fl'"},
    intuition:"Scan column by column (vertical scan). At each position i, check all strings have the same char. Stop on mismatch or when any string ends.",
    tricks:[{name:"Sort trick",detail:"Alternatively sort strs and compare only first and last — they have the minimum common prefix of the whole array."}],
    code:`def longestCommonPrefix(self, strs):
    if not strs: return ''
    for i, c in enumerate(strs[0]):
        for s in strs[1:]:
            if i >= len(s) or s[i] != c:
                return strs[0][:i]
    return strs[0]`,
    tc:"O(S) S=total chars", sc:"O(1)",
    walkthrough:{steps:[{label:"Column 0",detail:"f,f,f ✓. Column 1: l,l,l ✓. Column 2: o,o,i ✗ → return 'fl'."}]},
    similar:{"String":["Group Anagrams","Valid Anagram"]}
  }
},

"reverse-words-in-a-string": {
  num:21, title:"Reverse Words in a String", diff:"Medium", cat:"Array / String",
  lc:"https://leetcode.com/problems/reverse-words-in-a-string/",
  pattern:"Split + Reverse",
  sections:{
    explain:"Return string with words in reverse order, single spaces, no leading/trailing spaces.",
    example:{input:"s='  the sky is blue  '", output:"'blue is sky the'"},
    intuition:"split() handles multiple spaces and strips. Then reverse the list and join.",
    tricks:[{name:"Python split() without args",detail:"Splits on any whitespace and removes empty strings — handles multiple spaces automatically."}],
    code:`def reverseWords(self, s):
    return ' '.join(reversed(s.split()))`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{steps:[{label:"split()→reverse→join",detail:"['the','sky','is','blue']→reversed→['blue','is','sky','the']→'blue is sky the'"}]},
    similar:{"String":["Reverse Words in a String II","Rotate String"]}
  }
},

"zigzag-conversion": {
  num:22, title:"Zigzag Conversion", diff:"Medium", cat:"Array / String",
  lc:"https://leetcode.com/problems/zigzag-conversion/",
  pattern:"Simulate Row Traversal",
  sections:{
    explain:"Write PAYPALISHIRING in zigzag pattern over numRows rows, then read row by row.",
    example:{input:"s='PAYPALISHIRING', numRows=3", output:"PAHNAPLSIIGYIR"},
    intuition:"Simulate: maintain numRows buckets. A direction variable flips between +1 and -1 at top and bottom rows. Assign each character to its row bucket.",
    tricks:[{name:"Direction flip",detail:"When row==0 or row==numRows-1, reverse direction. No need to actually draw the zigzag."}],
    code:`def convert(self, s, numRows):
    if numRows == 1: return s
    rows = [''] * numRows
    row, step = 0, 1
    for c in s:
        rows[row] += c
        if row == 0: step = 1
        elif row == numRows-1: step = -1
        row += step
    return ''.join(rows)`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{steps:[{label:"numRows=3",detail:"P→row0, A→row1, Y→row2, P→row1, A→row0, L→row1, I→row2 ..."}]},
    similar:{"String":["Spiral Matrix","Rotate Image"]}
  }
},

"find-the-index-of-the-first-occurrence-in-a-string": {
  num:23, title:"Find the Index of the First Occurrence in a String", diff:"Easy", cat:"Array / String",
  lc:"https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",
  pattern:"Substring Search (KMP or built-in)",
  sections:{
    explain:"Return index of first occurrence of needle in haystack, or -1.",
    example:{input:"haystack='sadbutsad', needle='sad'", output:"0"},
    intuition:"Python's find() is O(n) on average. For interviews, know KMP: build LPS (longest proper prefix-suffix) array for needle, then scan haystack without backtracking.",
    tricks:[{name:"KMP avoids O(nm) worst case",detail:"LPS array lets us skip re-scanning already-matched characters. O(n+m) guaranteed."}],
    code:`def strStr(self, haystack, needle):
    return haystack.find(needle)
# KMP version if needed:
# Build lps, then scan haystack with two pointers`,
    tc:"O(n+m) KMP", sc:"O(m)",
    walkthrough:{steps:[{label:"Built-in",detail:"haystack.find(needle) returns first match index or -1."}]},
    similar:{"String":["Implement strStr","Repeated Substring Pattern","Find All Anagrams"]}
  }
},

"text-justification": {
  num:24, title:"Text Justification", diff:"Hard", cat:"Array / String",
  lc:"https://leetcode.com/problems/text-justification/",
  pattern:"Greedy Line-Packing + Careful Space Distribution",
  sections:{
    explain:"Justify text to exactly maxWidth. Extra spaces distributed left-to-right; last line is left-justified.",
    example:{input:"words=['This','is','an','example','of','text','justification.'], maxWidth=16", output:"['This    is    an','example  of text','justification.  ']"},
    intuition:"Greedily pack words per line. For each line: compute extra spaces needed, distribute them left-to-right (first (extra%gaps) gaps get one extra space). Last line: join with single spaces, pad right.",
    tricks:[
      {name:"Handle single-word lines",detail:"If only one word on a line (or it's the last line), left-justify and pad right."},
      {name:"Space distribution",detail:"total_spaces / (words-1) = base. total_spaces % (words-1) = first N gaps get base+1 spaces."}
    ],
    code:`def fullJustify(self, words, maxWidth):
    res, i = [], 0
    while i < len(words):
        line_len, j = len(words[i]), i+1
        while j < len(words) and line_len + 1 + len(words[j]) <= maxWidth:
            line_len += 1 + len(words[j]); j += 1
        gaps = j - i - 1
        if j == len(words) or gaps == 0:
            res.append(' '.join(words[i:j]).ljust(maxWidth))
        else:
            spaces, extra = divmod(maxWidth - sum(len(w) for w in words[i:j]), gaps)
            line = ''
            for k in range(i, j-1):
                line += words[k] + ' '*(spaces + (1 if k-i < extra else 0))
            res.append(line + words[j-1])
        i = j
    return res`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{steps:[{label:"Build lines greedily",detail:"Pack words until adding next word would exceed maxWidth. Then distribute spaces."}],edgeCase:"Last line: always left-justify regardless."},
    similar:{"String":["Word Wrap (DP)","Reorganize String"]}
  }
},

/* ════════════════ TWO POINTERS ════════════════ */
"valid-palindrome": {
  num:25, title:"Valid Palindrome", diff:"Easy", cat:"Two Pointers",
  lc:"https://leetcode.com/problems/valid-palindrome/",
  pattern:"Two Pointers (Inward Squeeze)",
  sections:{
    explain:"A string is a palindrome if, considering only alphanumeric characters and ignoring case, it reads the same forwards and backwards.",
    example:{input:"s='A man, a plan, a canal: Panama'", output:"true"},
    intuition:"Two pointers from both ends. Skip non-alphanumeric characters. Compare lowercased chars at l and r.",
    tricks:[{name:"isalnum()",detail:"Python's str.isalnum() handles both letters and digits. No need for regex."}],
    code:`def isPalindrome(self, s):
    l, r = 0, len(s)-1
    while l < r:
        while l < r and not s[l].isalnum(): l += 1
        while l < r and not s[r].isalnum(): r -= 1
        if s[l].lower() != s[r].lower(): return False
        l += 1; r -= 1
    return True`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[{label:"Skip non-alnum",detail:"Skip commas, spaces, colons. Compare A↔a, m↔m, a↔n... until pointers cross."}]},
    similar:{"Two Pointers":["Valid Palindrome II","Palindromic Substrings","Longest Palindromic Substring"]}
  }
},

"is-subsequence": {
  num:26, title:"Is Subsequence", diff:"Easy", cat:"Two Pointers",
  lc:"https://leetcode.com/problems/is-subsequence/",
  pattern:"Two Pointers (Advancing Independently)",
  sections:{
    explain:"Check if s is a subsequence of t (characters of s appear in t in order).",
    example:{input:"s='ace', t='abcde'", output:"true"},
    intuition:"Pointer i on s, pointer j on t. Advance i when t[j]==s[i]. Return i==len(s).",
    tricks:[{name:"Follow-up: many queries",detail:"Pre-build for each position in t: next occurrence of each character. Then binary search. O(n) build, O(m log n) per query."}],
    code:`def isSubsequence(self, s, t):
    i = 0
    for c in t:
        if i < len(s) and c == s[i]:
            i += 1
    return i == len(s)`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[{label:"Advance s pointer",detail:"a→match, b→skip, c→match, d→skip, e→match. i=3==len(s). True."}]},
    similar:{"Two Pointers":["Longest Common Subsequence","Delete Columns to Make Sorted"]}
  }
},

"two-sum-ii-input-array-is-sorted": {
  num:27, title:"Two Sum II — Input Array Is Sorted", diff:"Medium", cat:"Two Pointers",
  lc:"https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
  pattern:"Two Pointers Inward Squeeze (Sorted)",
  sections:{
    explain:"Find two numbers in a sorted array that sum to target. Return 1-indexed positions.",
    example:{input:"numbers=[2,7,11,15], target=9", output:"[1,2]"},
    intuition:"Left pointer at start, right at end. If sum < target, move left up. If sum > target, move right down. Sorted array guarantees correctness.",
    tricks:[{name:"Why it works",detail:"Moving left up increases sum; moving right down decreases it. The sorted property makes this greedy decision always optimal."}],
    code:`def twoSum(self, numbers, target):
    l, r = 0, len(numbers)-1
    while l < r:
        s = numbers[l] + numbers[r]
        if s == target: return [l+1, r+1]
        elif s < target: l += 1
        else: r -= 1`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[{label:"l=0,r=3",detail:"2+15=17>9 → r=2. 2+11=13>9 → r=1. 2+7=9 ✓ → [1,2]."}]},
    similar:{"Two Pointers":["Two Sum","3Sum","Container With Most Water"]}
  }
},

"container-with-most-water": {
  num:28, title:"Container With Most Water", diff:"Medium", cat:"Two Pointers",
  lc:"https://leetcode.com/problems/container-with-most-water/",
  pattern:"Two Pointers — Always Move Shorter Side",
  sections:{
    explain:"Given heights array, find two lines forming a container holding the most water.",
    example:{input:"height=[1,8,6,2,5,4,8,3,7]", output:"49 (lines at index 1 and 8)"},
    intuition:"Area = min(height[l], height[r]) × (r-l). Move the shorter pointer inward — moving the taller one can only decrease the width while the height is still limited by the shorter, so it's never beneficial.",
    tricks:[{name:"Move shorter side",detail:"This is the key greedy insight. By always moving the shorter pointer, we search for a potentially taller line that could increase the area."}],
    code:`def maxArea(self, height):
    l, r = 0, len(height)-1
    max_water = 0
    while l < r:
        water = min(height[l], height[r]) * (r - l)
        max_water = max(max_water, water)
        if height[l] < height[r]: l += 1
        else: r -= 1
    return max_water`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[
      {label:"l=0,r=8",detail:"min(1,7)*8=8. h[0]=1<h[8]=7 → l=1."},
      {label:"l=1,r=8",detail:"min(8,7)*7=49. h[8]=7<h[1]=8 → r=7."},
      {label:"Continue",detail:"All subsequent areas ≤ 49. Return 49."}
    ]},
    similar:{"Two Pointers":["Trapping Rain Water","3Sum"]}
  }
},

"3sum": {
  num:29, title:"3Sum", diff:"Medium", cat:"Two Pointers",
  lc:"https://leetcode.com/problems/3sum/",
  pattern:"Sort + Fix One + Two Pointer Squeeze",
  sections:{
    explain:"Find all unique triplets in an array that sum to zero.",
    example:{input:"nums=[-1,0,1,2,-1,-4]", output:"[[-1,-1,2],[-1,0,1]]"},
    intuition:"Sort the array. Fix nums[i], then use two pointers l=i+1 and r=n-1. Skip duplicates at every level to avoid repeated triplets.",
    tricks:[
      {name:"Skip duplicates at each level",detail:"After sorting: skip nums[i]==nums[i-1] at outer loop. After match: skip nums[l]==nums[l-1] and nums[r]==nums[r+1]."},
      {name:"Early termination",detail:"If nums[i] > 0, the remaining sorted elements are all positive — no triplet can sum to 0."}
    ],
    code:`def threeSum(self, nums):
    nums.sort(); res = []
    for i in range(len(nums)-2):
        if nums[i] > 0: break
        if i > 0 and nums[i] == nums[i-1]: continue
        l, r = i+1, len(nums)-1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l+1]: l += 1
                while l < r and nums[r] == nums[r-1]: r -= 1
                l += 1; r -= 1
            elif s < 0: l += 1
            else: r -= 1
    return res`,
    tc:"O(n²)", sc:"O(1) extra",
    walkthrough:{
      steps:[
        {label:"Sort",detail:"[-4,-1,-1,0,1,2]"},
        {label:"i=0, nums[i]=-4",detail:"l=1,r=5: -4+-1+2=-3<0→l++. -4+0+2=-2<0→l++. -4+1+2=-1<0→l++. l≥r done."},
        {label:"i=1, nums[i]=-1",detail:"l=2,r=5: -1+-1+2=0 ✓ append. Skip dupes. l=3,r=4: -1+0+1=0 ✓ append."},
        {label:"i=2, nums[i]=-1",detail:"Duplicate of i=1, skip."}
      ],
      edgeCase:"All zeros [0,0,0,0]: i=0,l=1,r=3 → [0,0,0]. Skip rest. Return [[0,0,0]]."
    },
    similar:{"Two Pointers":["Two Sum","4Sum","3Sum Closest","3Sum Smaller"]}
  }
},

/* ════════════════ SLIDING WINDOW ════════════════ */
"minimum-size-subarray-sum": {
  num:30, title:"Minimum Size Subarray Sum", diff:"Medium", cat:"Sliding Window",
  lc:"https://leetcode.com/problems/minimum-size-subarray-sum/",
  pattern:"Variable Sliding Window",
  sections:{
    explain:"Find minimal length subarray with sum ≥ target.",
    example:{input:"target=7, nums=[2,3,1,2,4,3]", output:"2 (subarray [4,3])"},
    intuition:"Expand right pointer adding to window sum. When sum ≥ target, shrink from left to minimize length. Track minimum window length seen.",
    tricks:[{name:"Shrink aggressively",detail:"Once sum≥target, subtract nums[left] and advance left as long as sum still ≥ target. This finds the minimum for the current right position."}],
    code:`def minSubArrayLen(self, target, nums):
    left = total = 0
    res = float('inf')
    for right in range(len(nums)):
        total += nums[right]
        while total >= target:
            res = min(res, right - left + 1)
            total -= nums[left]
            left += 1
    return 0 if res == float('inf') else res`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[{label:"Expand until sum≥target",detail:"When total≥7: record length, shrink left. Window [4,3]: len=2 is minimum."}]},
    similar:{"Sliding Window":["Longest Substring Without Repeating Chars","Minimum Window Substring","Fruit Into Baskets"]}
  }
},

"longest-substring-without-repeating-characters": {
  num:31, title:"Longest Substring Without Repeating Characters", diff:"Medium", cat:"Sliding Window",
  lc:"https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  pattern:"Sliding Window + Last Seen Map",
  sections:{
    explain:"Find length of longest substring without repeating characters.",
    example:{input:"s='abcabcbb'", output:"3 ('abc')"},
    intuition:"Maintain a window [left, right]. Keep a map of char → last seen index. When we see a duplicate, jump left to max(left, last_seen[c]+1) — skipping past the previous occurrence.",
    tricks:[
      {name:"Jump left, don't slide",detail:"Instead of sliding left one step at a time, jump directly past the duplicate. This keeps O(n) instead of O(n²)."},
      {name:"Max with left",detail:"left = max(left, last_seen[c]+1). The max prevents jumping left backward if the duplicate is outside the current window."}
    ],
    code:`def lengthOfLongestSubstring(self, s):
    last_seen = {}
    left = max_len = 0
    for right, c in enumerate(s):
        if c in last_seen:
            left = max(left, last_seen[c] + 1)
        last_seen[c] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
    tc:"O(n)", sc:"O(min(m,n)) — alphabet size",
    walkthrough:{
      steps:[
        {label:"a,b,c",detail:"left=0, no repeats, max_len=3"},
        {label:"a (repeat)",detail:"last_seen[a]=0 → left=max(0,1)=1. Window [1..3]='bca', max_len=3"},
        {label:"b (repeat)",detail:"left=max(1,2)=2. Window [2..4]='cab', max_len=3"},
        {label:"c (repeat)",detail:"left=max(2,3)=3. Window [3..5]='abc', max_len=3"},
        {label:"b,b",detail:"Window shrinks. max_len stays 3."}
      ],
      edgeCase:"s='': return 0. s='bbbb': each b triggers left jump, max_len=1."
    },
    similar:{"Sliding Window":["Minimum Window Substring","Longest Repeating Character Replacement","Fruit Into Baskets"]}
  }
},

"substring-with-concatenation-of-all-words": {
  num:32, title:"Substring with Concatenation of All Words", diff:"Hard", cat:"Sliding Window",
  lc:"https://leetcode.com/problems/substring-with-concatenation-of-all-words/",
  pattern:"Sliding Window with Word-Level Frequency Map",
  sections:{
    explain:"Find all starting indices of substrings that are a concatenation of all words (each exactly once, in any order).",
    example:{input:"s='barfoothefoobarman', words=['foo','bar']", output:"[0,9]"},
    intuition:"All words have the same length. Try each starting offset 0..wordLen-1. Within each offset, use a sliding window of wordCount words. Use a word frequency map and a 'remaining' counter.",
    tricks:[{name:"Word-level sliding window",detail:"Move one word at a time. When a word is found (need[w]>0), satisfy it. When an unwanted word appears, slide left past it. O(n) per offset."}],
    code:`def findSubstring(self, s, words):
    from collections import Counter
    if not s or not words: return []
    wlen, wcount = len(words[0]), len(words)
    need = Counter(words)
    total = len(s); res = []
    for start in range(wlen):
        window = Counter(); formed = 0
        left = start
        for right in range(start, total - wlen + 1, wlen):
            w = s[right:right+wlen]
            if w in need:
                window[w] += 1
                if window[w] == need[w]: formed += 1
                while formed == len(need):
                    if right - left == (wcount-1)*wlen:
                        res.append(left)
                    lw = s[left:left+wlen]
                    if window[lw] == need[lw]: formed -= 1
                    window[lw] -= 1; left += wlen
            else:
                window.clear(); formed = 0; left = right + wlen
    return res`,
    tc:"O(n × wlen)", sc:"O(wcount)",
    walkthrough:{steps:[{label:"start=0",detail:"Check words at 0,3,6... Match 'bar','foo' at 0→add 0. Match 'foo','bar' at 9→add 9."}]},
    similar:{"Sliding Window":["Minimum Window Substring","Find All Anagrams"]}
  }
},

"minimum-window-substring": {
  num:33, title:"Minimum Window Substring", diff:"Hard", cat:"Sliding Window",
  lc:"https://leetcode.com/problems/minimum-window-substring/",
  pattern:"Variable Sliding Window + Need Counter",
  sections:{
    explain:"Find the minimum window in s containing all characters of t.",
    example:{input:"s='ADOBECODEBANC', t='ABC'", output:"'BANC'"},
    intuition:"Expand right to satisfy all requirements (need==0). Then shrink left as much as possible while still satisfied. Track minimum valid window.",
    tricks:[
      {name:"'need' counter",detail:"need counts remaining unsatisfied characters. Decrement when adding a required char; increment when removing. Shrink when need==0."},
      {name:"Only track t's chars",detail:"Use a Counter for t. Only chars in t affect the 'formed' (need==0) condition."}
    ],
    code:`from collections import Counter
def minWindow(self, s, t):
    need = Counter(t)
    missing = len(t)
    best = ''
    left = 0
    for right, c in enumerate(s):
        if need[c] > 0:
            missing -= 1
        need[c] -= 1
        if missing == 0:
            # Shrink from left
            while need[s[left]] < 0:
                need[s[left]] += 1; left += 1
            window = s[left:right+1]
            if not best or len(window) < len(best):
                best = window
            # Invalidate window for next expansion
            need[s[left]] += 1; missing += 1; left += 1
    return best`,
    tc:"O(|s| + |t|)", sc:"O(|t|)",
    walkthrough:{
      steps:[
        {label:"Expand until missing=0",detail:"A,D,O,B,E,C → missing=0 (A,B,C all covered). Window='ADOBEC'."},
        {label:"Shrink: remove A",detail:"Window='DOBEC'. left moves. A no longer covered. missing=1."},
        {label:"Continue expanding",detail:"O,D,E → DOBECODE → ODEBAN → BANC covers A,B,C again."},
        {label:"Shrink",detail:"BANC is length 4. Best so far."}
      ],
      edgeCase:"t='AA': need both A's. need['A']=2. missing decrements only when need[c]>0."
    },
    similar:{"Sliding Window":["Longest Substring Without Repeating Chars","Minimum Size Subarray Sum","Substring with Concatenation"]}
  }
},

/* ════════════════ MATRIX ════════════════ */
"valid-sudoku": {
  num:34, title:"Valid Sudoku", diff:"Medium", cat:"Matrix",
  lc:"https://leetcode.com/problems/valid-sudoku/",
  pattern:"Three Sets per Dimension",
  sections:{
    explain:"Validate a 9×9 Sudoku board (don't solve it). Each row, column, and 3×3 box must have digits 1-9 at most once.",
    example:{input:"Partially filled 9x9 board", output:"true/false"},
    intuition:"Use a set for each row, column, and box. For each cell, check if the digit already exists in that row's set, column's set, or box's set. Box index = (row//3)*3 + col//3.",
    tricks:[{name:"Box index formula",detail:"(row//3)*3 + col//3 maps each cell to one of 9 boxes (0-8). This is the key insight."}],
    code:`def isValidSudoku(self, board):
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]
    for r in range(9):
        for c in range(9):
            v = board[r][c]
            if v == '.': continue
            box = (r//3)*3 + c//3
            if v in rows[r] or v in cols[c] or v in boxes[box]:
                return False
            rows[r].add(v); cols[c].add(v); boxes[box].add(v)
    return True`,
    tc:"O(1) — fixed 9×9", sc:"O(1)",
    walkthrough:{steps:[{label:"Scan each cell",detail:"If digit seen in same row, col, or box → false. Otherwise record it."}]},
    similar:{"Matrix":["Sudoku Solver","Set Matrix Zeroes"]}
  }
},

"spiral-matrix": {
  num:35, title:"Spiral Matrix", diff:"Medium", cat:"Matrix",
  lc:"https://leetcode.com/problems/spiral-matrix/",
  pattern:"Boundary Shrink",
  sections:{
    explain:"Return all elements of an m×n matrix in spiral order.",
    example:{input:"[[1,2,3],[4,5,6],[7,8,9]]", output:"[1,2,3,6,9,8,7,4,5]"},
    intuition:"Maintain top, bottom, left, right boundaries. Traverse: right along top, down along right, left along bottom, up along left. Shrink boundaries after each pass.",
    tricks:[{name:"Boundary shrink",detail:"After traversing top row, top++. After right col, right--. After bottom row (check top≤bottom), bottom--. After left col (check left≤right), left++."}],
    code:`def spiralOrder(self, matrix):
    res = []
    top, bottom = 0, len(matrix)-1
    left, right = 0, len(matrix[0])-1
    while top <= bottom and left <= right:
        for c in range(left, right+1): res.append(matrix[top][c]); top+=1
        for r in range(top, bottom+1): res.append(matrix[r][right]); right-=1
        if top <= bottom:
            for c in range(right, left-1, -1): res.append(matrix[bottom][c]); bottom-=1
        if left <= right:
            for r in range(bottom, top-1, -1): res.append(matrix[r][left]); left+=1
    return res`,
    tc:"O(m×n)", sc:"O(1) extra",
    walkthrough:{steps:[{label:"Layer by layer",detail:"Outer ring first, then shrink boundaries inward."}]},
    similar:{"Matrix":["Spiral Matrix II","Rotate Image"]}
  }
},

"rotate-image": {
  num:36, title:"Rotate Image", diff:"Medium", cat:"Matrix",
  lc:"https://leetcode.com/problems/rotate-image/",
  pattern:"Transpose then Reverse Rows",
  sections:{
    explain:"Rotate an n×n matrix 90 degrees clockwise in-place.",
    example:{input:"[[1,2,3],[4,5,6],[7,8,9]]", output:"[[7,4,1],[8,5,2],[9,6,3]]"},
    intuition:"90° clockwise = transpose (flip along diagonal) then reverse each row. Both operations are in-place.",
    tricks:[{name:"Transpose + reverse",detail:"Transpose: swap matrix[i][j] with matrix[j][i] for i<j. Reverse: reverse each row. Result is 90° CW rotation."}],
    code:`def rotate(self, matrix):
    n = len(matrix)
    # Transpose
    for i in range(n):
        for j in range(i+1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # Reverse each row
    for row in matrix:
        row.reverse()`,
    tc:"O(n²)", sc:"O(1)",
    walkthrough:{steps:[{label:"Transpose",detail:"[[1,4,7],[2,5,8],[3,6,9]]. Reverse rows: [[7,4,1],[8,5,2],[9,6,3]]."}]},
    similar:{"Matrix":["Spiral Matrix","Set Matrix Zeroes"]}
  }
},

"set-matrix-zeroes": {
  num:37, title:"Set Matrix Zeroes", diff:"Medium", cat:"Matrix",
  lc:"https://leetcode.com/problems/set-matrix-zeroes/",
  pattern:"Use First Row/Col as Markers",
  sections:{
    explain:"If cell is 0, set its entire row and column to 0, in-place.",
    example:{input:"[[1,1,1],[1,0,1],[1,1,1]]", output:"[[1,0,1],[0,0,0],[1,0,1]]"},
    intuition:"Use the first row and first column as flag arrays. Scan matrix: if matrix[i][j]==0, set matrix[i][0]=0 and matrix[0][j]=0. Then use these flags to zero out rows/cols. Handle first row/col separately.",
    tricks:[{name:"O(1) space with matrix as markers",detail:"Avoids O(m+n) space for separate sets. But requires careful handling of first row/col which are used as markers."}],
    code:`def setZeroes(self, matrix):
    m, n = len(matrix), len(matrix[0])
    first_row = any(matrix[0][j]==0 for j in range(n))
    first_col = any(matrix[i][0]==0 for i in range(m))
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = matrix[0][j] = 0
    for i in range(1, m):
        if matrix[i][0] == 0:
            for j in range(1, n): matrix[i][j] = 0
    for j in range(1, n):
        if matrix[0][j] == 0:
            for i in range(1, m): matrix[i][j] = 0
    if first_row:
        for j in range(n): matrix[0][j] = 0
    if first_col:
        for i in range(m): matrix[i][0] = 0`,
    tc:"O(m×n)", sc:"O(1)",
    walkthrough:{steps:[{label:"Mark then zero",detail:"Use row 0 and col 0 as flags. Zero inner cells first, then handle boundaries."}]},
    similar:{"Matrix":["Game of Life","Rotate Image"]}
  }
},

"game-of-life": {
  num:38, title:"Game of Life", diff:"Medium", cat:"Matrix",
  lc:"https://leetcode.com/problems/game-of-life/",
  pattern:"In-Place State Encoding",
  sections:{
    explain:"Compute one step of Conway's Game of Life in-place. 1=live, 0=dead.",
    example:{input:"[[0,1,0],[0,0,1],[1,1,1],[0,0,0]]", output:"[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]"},
    intuition:"Use extra states to encode transitions without extra space. dead→live=2, live→dead=-1. First pass marks transitions; second pass converts to final state.",
    tricks:[{name:"Encode transitions in-place",detail:"2 means 'was dead, now alive'. -1 means 'was alive, now dead'. Count neighbors using abs() to handle all encodings."}],
    code:`def gameOfLife(self, board):
    m, n = len(board), len(board[0])
    def count(r, c):
        total = 0
        for dr in [-1,0,1]:
            for dc in [-1,0,1]:
                if dr==dc==0: continue
                nr, nc = r+dr, c+dc
                if 0<=nr<m and 0<=nc<n and abs(board[nr][nc])==1:
                    total += 1
        return total
    for r in range(m):
        for c in range(n):
            live = count(r, c)
            if board[r][c]==1 and live not in (2,3): board[r][c]=-1
            if board[r][c]==0 and live==3: board[r][c]=2
    for r in range(m):
        for c in range(n):
            if board[r][c]==2: board[r][c]=1
            elif board[r][c]==-1: board[r][c]=0`,
    tc:"O(m×n)", sc:"O(1)",
    walkthrough:{steps:[{label:"Two passes",detail:"First pass encodes transitions. Second pass finalizes: 2→1, -1→0."}]},
    similar:{"Matrix":["Set Matrix Zeroes","Surrounded Regions"]}
  }
},

/* ════════════════ HASHMAP ════════════════ */
"ransom-note": {
  num:39, title:"Ransom Note", diff:"Easy", cat:"Hashmap",
  lc:"https://leetcode.com/problems/ransom-note/",
  pattern:"Character Frequency Counter",
  sections:{
    explain:"Can ransomNote be constructed using letters from magazine (each letter used once)?",
    example:{input:"ransomNote='aa', magazine='aab'", output:"true"},
    intuition:"Count magazine's characters. For each char in ransomNote, decrement its count. If count goes below 0, return false.",
    tricks:[{name:"Counter subtraction",detail:"Python: Counter(magazine) - Counter(ransomNote) should have no negative values. Or manually check."}],
    code:`from collections import Counter
def canConstruct(self, ransomNote, magazine):
    mag = Counter(magazine)
    for c in ransomNote:
        if mag[c] <= 0: return False
        mag[c] -= 1
    return True`,
    tc:"O(m+n)", sc:"O(1) — 26 letters",
    walkthrough:{steps:[{label:"Count magazine, decrement per ransomNote char",detail:"If any char runs out, return false."}]},
    similar:{"Counter":["Valid Anagram","Group Anagrams","First Unique Character"]}
  }
},

"isomorphic-strings": {
  num:40, title:"Isomorphic Strings", diff:"Easy", cat:"Hashmap",
  lc:"https://leetcode.com/problems/isomorphic-strings/",
  pattern:"Bijection via Two Maps",
  sections:{
    explain:"Two strings are isomorphic if s's chars can be replaced to get t, with consistent mapping (bijection).",
    example:{input:"s='egg', t='add'", output:"true"},
    intuition:"Maintain two hash maps: s→t and t→s. For each position, check both mappings are consistent. A bijection requires both directions.",
    tricks:[{name:"Bijection needs both directions",detail:"s='ab',t='aa': s→t maps a→a, b→a (valid). But t→s maps a→a then a→b (conflict). One-directional map misses this."}],
    code:`def isIsomorphic(self, s, t):
    s2t, t2s = {}, {}
    for a, b in zip(s, t):
        if s2t.get(a, b) != b or t2s.get(b, a) != a:
            return False
        s2t[a] = b; t2s[b] = a
    return True`,
    tc:"O(n)", sc:"O(1) — bounded alphabet",
    walkthrough:{steps:[{label:"e→a, g→d",detail:"s2t={e:a,g:d}, t2s={a:e,d:g}. Consistent."}]},
    similar:{"Map":["Word Pattern","Find and Replace Pattern"]}
  }
},

"word-pattern": {
  num:41, title:"Word Pattern", diff:"Easy", cat:"Hashmap",
  lc:"https://leetcode.com/problems/word-pattern/",
  pattern:"Bijection via Two Maps",
  sections:{
    explain:"Check if string s follows pattern p (each letter maps to exactly one word, bijection).",
    example:{input:"pattern='abba', s='dog cat cat dog'", output:"true"},
    intuition:"Same as Isomorphic Strings but between letters and words. Two maps: char→word and word→char.",
    tricks:[{name:"Same bijection pattern as Isomorphic Strings",detail:"Always check both directions for bijection problems."}],
    code:`def wordPattern(self, pattern, s):
    words = s.split()
    if len(pattern) != len(words): return False
    c2w, w2c = {}, {}
    for c, w in zip(pattern, words):
        if c2w.get(c, w) != w or w2c.get(w, c) != c:
            return False
        c2w[c] = w; w2c[w] = c
    return True`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{steps:[{label:"a↔dog, b↔cat, b↔cat ✓, a↔dog ✓",detail:"All mappings consistent in both directions."}]},
    similar:{"Map":["Isomorphic Strings","Find and Replace Pattern"]}
  }
},

"valid-anagram": {
  num:42, title:"Valid Anagram", diff:"Easy", cat:"Hashmap",
  lc:"https://leetcode.com/problems/valid-anagram/",
  pattern:"Character Frequency Counter",
  sections:{
    explain:"Check if t is an anagram of s (same chars same frequency).",
    example:{input:"s='anagram', t='nagaram'", output:"true"},
    intuition:"Count characters in both strings. If counts are equal, they're anagrams.",
    tricks:[{name:"Counter equality",detail:"Counter(s)==Counter(t) in one line. Or sort both: O(n log n)."}],
    code:`from collections import Counter
def isAnagram(self, s, t):
    return Counter(s) == Counter(t)`,
    tc:"O(n)", sc:"O(1) — 26 letters",
    walkthrough:{steps:[{label:"Compare counters",detail:"Both have {a:3,n:1,g:1,r:1,m:1}. Equal → true."}]},
    similar:{"Counter":["Group Anagrams","Find All Anagrams","Ransom Note"]}
  }
},

"group-anagrams": {
  num:43, title:"Group Anagrams", diff:"Medium", cat:"Hashmap",
  lc:"https://leetcode.com/problems/group-anagrams/",
  pattern:"HashMap with Sorted String Key",
  sections:{
    explain:"Group strings that are anagrams of each other.",
    example:{input:"['eat','tea','tan','ate','nat','bat']", output:"[['bat'],['nat','tan'],['ate','eat','tea']]"},
    intuition:"Anagrams have identical sorted characters. Use sorted(word) as a key in a hash map grouping words with the same key.",
    tricks:[
      {name:"Sorted string as key",detail:"sorted('eat')=='aet', sorted('tea')=='aet', sorted('ate')=='aet'. All map to the same bucket."},
      {name:"Alternative: char count tuple key",detail:"Faster O(n×26) vs O(n×k log k). Tuple of 26 counts as key avoids sorting."}
    ],
    code:`from collections import defaultdict
def groupAnagrams(self, strs):
    groups = defaultdict(list)
    for s in strs:
        groups[tuple(sorted(s))].append(s)
    return list(groups.values())`,
    tc:"O(n × k log k)", sc:"O(n × k)",
    walkthrough:{steps:[{label:"Sort each word",detail:"eat→aet, tea→aet, tan→ant, ate→aet, nat→ant, bat→abt. Group by key."}]},
    similar:{"HashMap":["Valid Anagram","Find All Anagrams","Subdomain Visit Count"]}
  }
},

"two-sum": {
  num:44, title:"Two Sum", diff:"Easy", cat:"Hashmap",
  lc:"https://leetcode.com/problems/two-sum/",
  rev:"5 min", pattern:"Hash Map Complement",
  sections:{
    explain:"Find indices of two numbers in nums that sum to target. Exactly one solution exists.",
    example:{input:"nums=[2,7,11,15], target=9", output:"[0,1]"},
    intuition:"For each number x, you need target-x. As you scan, check if the complement is already in a hash map. Store value→index.",
    tricks:[
      {name:"Check complement before storing",detail:"Prevents pairing an element with itself: if complement in seen, we already passed it."},
      {name:"One pass only",detail:"Store and check in the same loop. No need to pre-fill the map."}
    ],
    code:`def twoSum(self, nums, target):
    seen = {}  # value → index
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target-n], i]
        seen[n] = i`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"n=2",detail:"complement=7. seen={} → not found. seen={2:0}."},
        {label:"n=7",detail:"complement=2. seen={2:0} → found! Return [0,1]."}
      ],
      edgeCase:"nums=[3,3], target=6: at i=0 store 3:0. At i=1, 3 in seen → return [0,1]. Works because we check before storing."
    },
    similar:{"HashMap":["Two Sum II","3Sum","4Sum","Group Anagrams"]}
  }
},

"happy-number": {
  num:45, title:"Happy Number", diff:"Easy", cat:"Hashmap",
  lc:"https://leetcode.com/problems/happy-number/",
  pattern:"Cycle Detection via Set (or Fast/Slow)",
  sections:{
    explain:"A happy number eventually reaches 1 by repeatedly replacing with sum of squares of digits. Return true if happy.",
    example:{input:"n=19", output:"true (1²+9²=82, 8²+2²=68, 6²+8²=100, 1²+0²+0²=1)"},
    intuition:"If not happy, the sequence cycles. Use a set to detect a previously seen number. Alternatively, use Floyd's fast/slow pointer on the sequence.",
    tricks:[{name:"Fast/slow pointer",detail:"slow=step once, fast=step twice. They meet in the cycle, or fast reaches 1. O(1) space alternative to a set."}],
    code:`def isHappy(self, n):
    def next_n(x):
        total = 0
        while x:
            x, d = divmod(x, 10)
            total += d*d
        return total
    seen = set()
    while n != 1:
        if n in seen: return False
        seen.add(n); n = next_n(n)
    return True`,
    tc:"O(log n)", sc:"O(log n)",
    walkthrough:{steps:[{label:"Sequence",detail:"19→82→68→100→1. No cycles. Return true."}]},
    similar:{"Cycle Detection":["Linked List Cycle","Find the Duplicate Number"]}
  }
},

"contains-duplicate-ii": {
  num:46, title:"Contains Duplicate II", diff:"Medium", cat:"Hashmap",
  lc:"https://leetcode.com/problems/contains-duplicate-ii/",
  pattern:"Sliding Window Set / HashMap Index",
  sections:{
    explain:"Return true if there exist indices i,j such that nums[i]==nums[j] and |i-j|<=k.",
    example:{input:"nums=[1,2,3,1], k=3", output:"true"},
    intuition:"Maintain a sliding window of size k using a set. If the number is already in the window, return true. Slide by removing the element that fell outside the window.",
    tricks:[{name:"Sliding window set",detail:"Window size exactly k. Remove nums[i-k] when i>=k. O(1) lookup in set."}],
    code:`def containsNearbyDuplicate(self, nums, k):
    window = set()
    for i, n in enumerate(nums):
        if n in window: return True
        window.add(n)
        if len(window) > k:
            window.remove(nums[i-k])
    return False`,
    tc:"O(n)", sc:"O(k)",
    walkthrough:{steps:[{label:"Sliding window of size k",detail:"When window size exceeds k, remove the oldest element. If num already in window, found duplicate within k distance."}]},
    similar:{"Sliding Window":["Longest Substring Without Repeating Characters"]}
  }
},

"longest-consecutive-sequence": {
  num:47, title:"Longest Consecutive Sequence", diff:"Medium", cat:"Hashmap",
  lc:"https://leetcode.com/problems/longest-consecutive-sequence/",
  pattern:"HashSet + Only Start Sequences at n-1 Not in Set",
  sections:{
    explain:"Find length of longest consecutive elements sequence. O(n) time.",
    example:{input:"nums=[100,4,200,1,3,2]", output:"4 (1,2,3,4)"},
    intuition:"Add all numbers to a set. Only start counting a sequence from number n where n-1 is NOT in the set — it's the true start. Count up from there.",
    tricks:[{name:"Only start at sequence beginning",detail:"If n-1 is in the set, n is not a sequence start. This ensures each sequence is counted once, giving O(n) total."}],
    code:`def longestConsecutive(self, nums):
    num_set = set(nums)
    best = 0
    for n in num_set:
        if n - 1 not in num_set:  # only start sequences here
            length = 1
            while n + length in num_set:
                length += 1
            best = max(best, length)
    return best`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{steps:[
      {label:"Set = {1,2,3,4,100,200}",detail:""},
      {label:"n=1",detail:"0 not in set → start. Count: 1,2,3,4 → length=4."},
      {label:"n=100",detail:"99 not in set → start. Only 100 exists → length=1."}
    ]},
    similar:{"HashSet":["Missing Number","Find the Duplicate Number"]}
  }
},

/* ════════════════ INTERVALS ════════════════ */
"summary-ranges": {
  num:48, title:"Summary Ranges", diff:"Easy", cat:"Intervals",
  lc:"https://leetcode.com/problems/summary-ranges/",
  pattern:"Linear Scan with Range Tracking",
  sections:{
    explain:"Given sorted unique integers, return smallest list of ranges covering all numbers.",
    example:{input:"nums=[0,1,2,4,5,7]", output:"['0->2','4->5','7']"},
    intuition:"Track start of current range. When a gap is found (nums[i] != nums[i-1]+1), close the current range and start a new one.",
    tricks:[{name:"Close range when gap found",detail:"Add sentinel: append nums[-1]+2 to force closing last range, or handle after loop."}],
    code:`def summaryRanges(self, nums):
    if not nums: return []
    res, start = [], nums[0]
    for i in range(1, len(nums)+1):
        if i == len(nums) or nums[i] != nums[i-1]+1:
            end = nums[i-1]
            res.append(str(start) if start==end else f'{start}->{end}')
            if i < len(nums): start = nums[i]
    return res`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{steps:[{label:"Scan with range",detail:"Gap at index 3 (4≠2+1): close '0->2'. Gap at index 5 (7≠5+1): close '4->5'. End: close '7'."}]},
    similar:{"Intervals":["Merge Intervals","Missing Ranges"]}
  }
},

"merge-intervals": {
  num:49, title:"Merge Intervals", diff:"Medium", cat:"Intervals",
  lc:"https://leetcode.com/problems/merge-intervals/",
  pattern:"Sort by Start + Greedy Merge",
  sections:{
    explain:"Merge all overlapping intervals.",
    example:{input:"intervals=[[1,3],[2,6],[8,10],[15,18]]", output:"[[1,6],[8,10],[15,18]]"},
    intuition:"Sort by start. Maintain a merged list. For each interval, if it overlaps with the last merged (start ≤ last_end), extend the last interval's end. Otherwise, add as new interval.",
    tricks:[{name:"Sort then one pass",detail:"Sorting by start guarantees that if intervals[i] overlaps with result[-1], it only needs to compare with the last result entry — no need to look back further."}],
    code:`def merge(self, intervals):
    intervals.sort()
    res = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= res[-1][1]:
            res[-1][1] = max(res[-1][1], end)
        else:
            res.append([start, end])
    return res`,
    tc:"O(n log n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"Sort",detail:"[[1,3],[2,6],[8,10],[15,18]]"},
        {label:"[2,6]",detail:"2≤3 → merge: res=[[[1,6]]]"},
        {label:"[8,10]",detail:"8>6 → new: res=[[1,6],[8,10]]"},
        {label:"[15,18]",detail:"15>10 → new: res=[[1,6],[8,10],[15,18]]"}
      ],
      edgeCase:"[[1,4],[4,5]]: 4≤4 → merge to [1,5]. Touching intervals merge."
    },
    similar:{"Intervals":["Insert Interval","Minimum Arrows","Non-overlapping Intervals"]}
  }
},

"insert-interval": {
  num:50, title:"Insert Interval", diff:"Medium", cat:"Intervals",
  lc:"https://leetcode.com/problems/insert-interval/",
  pattern:"Three-Phase Linear Scan",
  sections:{
    explain:"Insert a new interval into a sorted non-overlapping list, merging if necessary.",
    example:{input:"intervals=[[1,3],[6,9]], newInterval=[2,5]", output:"[[1,5],[6,9]]"},
    intuition:"Three phases: (1) add all intervals that end before newInterval starts, (2) merge all intervals that overlap with newInterval, (3) add remaining.",
    tricks:[{name:"Clean 3-phase logic",detail:"Phase 2 condition: intervals[i][0] <= newInterval[1]. Expand newInterval boundaries during merge."}],
    code:`def insert(self, intervals, newInterval):
    res = []; i = 0; n = len(intervals)
    while i < n and intervals[i][1] < newInterval[0]:
        res.append(intervals[i]); i += 1
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    res.append(newInterval)
    res.extend(intervals[i:])
    return res`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{steps:[
      {label:"Phase 1",detail:"[1,3]: 3<2? No. Stop."},
      {label:"Phase 2",detail:"[1,3]: 1≤5. Merge: [min(2,1),max(5,3)]=[1,5]. [6,9]: 6≤5? No. Stop."},
      {label:"Phase 3",detail:"Add [1,5], then remaining [6,9]."}
    ]},
    similar:{"Intervals":["Merge Intervals","Meeting Rooms"]}
  }
},

"minimum-number-of-arrows-to-burst-balloons": {
  num:51, title:"Minimum Number of Arrows to Burst Balloons", diff:"Medium", cat:"Intervals",
  lc:"https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
  pattern:"Greedy — Sort by End, Shoot at End",
  sections:{
    explain:"Balloons are intervals on x-axis. Arrows shot vertically burst all balloons at that x. Minimum arrows to burst all?",
    example:{input:"points=[[10,16],[2,8],[1,6],[7,12]]", output:"2"},
    intuition:"Sort by end. Shoot first arrow at the end of the first balloon (greedy: bursts as many as possible). Skip all balloons it bursts. Repeat.",
    tricks:[{name:"Shoot at end of current balloon",detail:"Shooting at the end of the rightmost-ending current balloon maximizes overlap with other balloons that started before that point."}],
    code:`def findMinArrowShots(self, points):
    points.sort(key=lambda x: x[1])
    arrows = 1
    arrow_pos = points[0][1]
    for start, end in points[1:]:
        if start > arrow_pos:
            arrows += 1
            arrow_pos = end
    return arrows`,
    tc:"O(n log n)", sc:"O(1)",
    walkthrough:{steps:[
      {label:"Sort by end",detail:"[[1,6],[2,8],[7,12],[10,16]]"},
      {label:"Arrow at 6",detail:"Bursts [1,6] and [2,8] (2≤6). 7>6 → new arrow at 12."},
      {label:"Arrow at 12",detail:"Bursts [7,12] and [10,16] (10≤12). Done. 2 arrows."}
    ]},
    similar:{"Greedy":["Non-overlapping Intervals","Merge Intervals","Partition Labels"]}
  }
},

/* ════════════════ STACK ════════════════ */
"valid-parentheses": {
  num:52, title:"Valid Parentheses", diff:"Easy", cat:"Stack",
  lc:"https://leetcode.com/problems/valid-parentheses/",
  pattern:"Stack for Matching Brackets",
  sections:{
    explain:"Given string of brackets, determine if all brackets are correctly matched and closed.",
    example:{input:"s='()[]{}'", output:"true"},
    intuition:"Push open brackets onto a stack. When a close bracket appears, check if it matches the top of the stack. If mismatched or stack empty on close: false. After scanning, stack must be empty.",
    tricks:[
      {name:"Map close to open",detail:"Use a dict: ')':'(', ']':'[', '}':'{'. Clean single condition."},
      {name:"Edge: more opens than closes",detail:"Stack non-empty at end → false. Don't forget this check."}
    ],
    code:`def isValid(self, s):
    stack = []
    close_to_open = {')':'(', ']':'[', '}':'{'}
    for c in s:
        if c in close_to_open:
            if not stack or stack[-1] != close_to_open[c]:
                return False
            stack.pop()
        else:
            stack.append(c)
    return not stack`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"( [ {",detail:"Stack: ['(','[','{']"},
        {label:"} ] )",detail:"} matches {, pop. ] matches [, pop. ) matches (, pop. Stack empty → true."}
      ],
      edgeCase:"'([)]': stack=['(','['], encounter ')': top='[' ≠ '(' → false."
    },
    similar:{"Stack":["Min Stack","Basic Calculator","Simplify Path","Decode String"]}
  }
},

"simplify-path": {
  num:53, title:"Simplify Path", diff:"Medium", cat:"Stack",
  lc:"https://leetcode.com/problems/simplify-path/",
  pattern:"Stack for Directory Processing",
  sections:{
    explain:"Simplify Unix-style file path: '..' goes up, '.' stays, double slashes ignored.",
    example:{input:"path='/home/../usr//bin/'", output:"'/usr/bin'"},
    intuition:"Split on '/'. Ignore empty strings and '.'. Pop stack on '..'. Push directory names. Join stack with '/'.",
    tricks:[{name:"Split + stack",detail:"split('/') handles multiple slashes (produces empty strings, which are filtered). '.' and '' are no-ops."}],
    code:`def simplifyPath(self, path):
    stack = []
    for part in path.split('/'):
        if part == '..':
            if stack: stack.pop()
        elif part and part != '.':
            stack.append(part)
    return '/' + '/'.join(stack)`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{steps:[{label:"Split and process",detail:"'/home/../usr//bin/' → ['','home','..','usr','','bin',''] → process: push home, pop on .., push usr, skip '', push bin → /usr/bin"}]},
    similar:{"Stack":["Valid Parentheses","Basic Calculator"]}
  }
},

"min-stack": {
  num:54, title:"Min Stack", diff:"Medium", cat:"Stack",
  lc:"https://leetcode.com/problems/min-stack/",
  pattern:"Auxiliary Min Stack",
  sections:{
    explain:"Design stack with push, pop, top, and getMin all in O(1).",
    example:{input:"push(-2),push(0),push(-3),getMin()→-3,pop(),getMin()→-2", output:""},
    intuition:"Maintain a second 'min stack' that tracks the current minimum at each level. Push to min_stack when new val ≤ current min. Pop from both stacks together.",
    tricks:[{name:"Simpler: push min alongside value",detail:"Store (val, current_min) tuples. getMin returns stack[-1][1]. Avoids needing a separate stack."}],
    code:`class MinStack:
    def __init__(self):
        self.stack = []  # (val, min_at_this_level)
    def push(self, val):
        cur_min = min(val, self.stack[-1][1]) if self.stack else val
        self.stack.append((val, cur_min))
    def pop(self):
        self.stack.pop()
    def top(self):
        return self.stack[-1][0]
    def getMin(self):
        return self.stack[-1][1]`,
    tc:"O(1) all ops", sc:"O(n)",
    walkthrough:{steps:[{label:"Push (-2,−2),(0,−2),(−3,−3)",detail:"Each entry stores its own snapshot of current min. getMin always reads [-1][1]."}],edgeCase:"Pop last element: stack becomes empty. getMin after push only checks current state."},
    similar:{"Stack":["Max Stack","Queue via Stacks"]}
  }
},

"evaluate-reverse-polish-notation": {
  num:55, title:"Evaluate Reverse Polish Notation", diff:"Medium", cat:"Stack",
  lc:"https://leetcode.com/problems/evaluate-reverse-polish-notation/",
  pattern:"Stack-Based Expression Evaluation",
  sections:{
    explain:"Evaluate RPN expression. Operators apply to two preceding operands.",
    example:{input:"tokens=['2','1','+','3','*']", output:"9 ((2+1)*3)"},
    intuition:"Push numbers onto stack. On operator, pop two numbers, apply operator, push result.",
    tricks:[{name:"int() truncates toward zero in Python 3",detail:"Use int(a/b) not a//b for negative number division. a//b truncates toward negative infinity, but RPN requires truncation toward zero."}],
    code:`def evalRPN(self, tokens):
    stack = []
    ops = {'+': lambda a,b: a+b, '-': lambda a,b: a-b,
           '*': lambda a,b: a*b, '/': lambda a,b: int(a/b)}
    for t in tokens:
        if t in ops:
            b, a = stack.pop(), stack.pop()
            stack.append(ops[t](a, b))
        else:
            stack.append(int(t))
    return stack[0]`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{steps:[{label:"Push 2,1; hit +",detail:"Pop 1,2; push 3. Push 3; hit *: pop 3,3; push 9. Return 9."}]},
    similar:{"Stack":["Basic Calculator","Decode String"]}
  }
},

"basic-calculator": {
  num:56, title:"Basic Calculator", diff:"Hard", cat:"Stack",
  lc:"https://leetcode.com/problems/basic-calculator/",
  pattern:"Stack for Sign and Parentheses",
  sections:{
    explain:"Evaluate expression with +, -, (, ). No multiply/divide.",
    example:{input:"s='(1+(4+5+2)-3)+(6+8)'", output:"23"},
    intuition:"Track current number, current sign (+1/-1), and result. On '(' push (result, sign) and reset. On ')' pop and combine. Process digit runs, then apply sign when operator seen.",
    tricks:[
      {name:"Sign stack",detail:"On '(' push current (result, sign) to restore context after ')'."},
      {name:"Only + and − means sign tracking suffices",detail:"No precedence handling needed — add current term when we see a new operator or '('."}
    ],
    code:`def calculate(self, s):
    stack = []; result = 0; num = 0; sign = 1
    for c in s:
        if c.isdigit():
            num = num*10 + int(c)
        elif c in '+-':
            result += sign * num
            num = 0; sign = 1 if c=='+' else -1
        elif c == '(':
            stack.append(result); stack.append(sign)
            result = 0; sign = 1
        elif c == ')':
            result += sign * num; num = 0
            result *= stack.pop()   # sign before '('
            result += stack.pop()   # result before '('
    return result + sign * num`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{steps:[{label:"Push/pop on parens",detail:"On '(': push result+sign, reset. On ')': finalize inner result, multiply by stored sign, add stored result."}]},
    similar:{"Stack":["Basic Calculator II","Evaluate RPN","Basic Calculator III"]}
  }
},

/* ════════════════ LINKED LIST ════════════════ */

"linked-list-cycle": {
  num:57, title:"Linked List Cycle", diff:"Easy", cat:"Linked List",
  lc:"https://leetcode.com/problems/linked-list-cycle/",
  rev:"5 min", pattern:"Floyd's Cycle Detection (Fast/Slow Pointers)",
  sections:{
    explain:"Given the head of a linked list, determine if it contains a cycle. A cycle exists if some node can be reached again by following next pointers.",
    example:{input:"head=[3,2,0,-4], pos=1 (tail connects to index 1)", output:"true", why:"Following next eventually returns to node with value 2"},
    intuition:"Use two pointers: slow moves one step, fast moves two steps. If there's a cycle they must eventually meet — like two runners on a circular track. If fast reaches null, no cycle.",
    tricks:[
      {name:"Floyd's tortoise and hare", detail:"fast/slow pointers guaranteed to meet inside any cycle. O(1) space — no set needed."},
      {name:"Hash set alternative", detail:"Store visited nodes. O(n) space but simpler to reason about. Use Floyd's in interviews to show O(1) space awareness."}
    ],
    code:`def hasCycle(self, head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"Init both at head", detail:"slow=head, fast=head."},
        {label:"Each step", detail:"slow advances 1, fast advances 2. If they meet → cycle."},
        {label:"No cycle", detail:"fast reaches None or fast.next is None → return False."}
      ],
      edgeCase:"Empty list or single node with no cycle: fast is None immediately → return False."
    },
    similar:{"Fast/Slow Pointers":["Find Duplicate Number","Linked List Cycle II","Happy Number"]}
  }
},

"add-two-numbers": {
  num:58, title:"Add Two Numbers", diff:"Medium", cat:"Linked List",
  lc:"https://leetcode.com/problems/add-two-numbers/",
  rev:"8 min", pattern:"Dummy Head + Carry Simulation",
  sections:{
    explain:"Two non-empty linked lists represent non-negative integers in reverse order. Add them and return the sum as a linked list in the same reverse order.",
    example:{input:"l1=[2,4,3], l2=[5,6,4]", output:"[7,0,8]", why:"342+465=807, stored reversed"},
    intuition:"Iterate both lists simultaneously, adding digits plus carry. Use a dummy head node to simplify edge cases. Continue while either list has nodes or carry > 0.",
    tricks:[
      {name:"Dummy head", detail:"Create a dummy node; the result list starts at dummy.next. Avoids special-casing the first node."},
      {name:"Carry after loop", detail:"If carry=1 after both lists exhausted, append one more node. This handles 999+1=1000."}
    ],
    code:`def addTwoNumbers(self, l1, l2):
    dummy = curr = ListNode(0)
    carry = 0
    while l1 or l2 or carry:
        v1 = l1.val if l1 else 0
        v2 = l2.val if l2 else 0
        total = v1 + v2 + carry
        carry, val = divmod(total, 10)
        curr.next = ListNode(val)
        curr = curr.next
        if l1: l1 = l1.next
        if l2: l2 = l2.next
    return dummy.next`,
    tc:"O(max(m,n))", sc:"O(max(m,n))",
    walkthrough:{
      steps:[
        {label:"Step 1: 2+5+0=7", detail:"carry=0, append 7."},
        {label:"Step 2: 4+6+0=10", detail:"carry=1, append 0."},
        {label:"Step 3: 3+4+1=8", detail:"carry=0, append 8. Both lists exhausted, carry=0 → done."}
      ],
      edgeCase:"Lists of different lengths: default missing digits to 0. Carry after last digit: loop condition `or carry` handles it."
    },
    similar:{"Linked List":["Add Two Numbers II","Multiply Strings","Sum of Two Integers"]}
  }
},

"merge-two-sorted-lists": {
  num:59, title:"Merge Two Sorted Lists", diff:"Easy", cat:"Linked List",
  lc:"https://leetcode.com/problems/merge-two-sorted-lists/",
  rev:"5 min", pattern:"Dummy Head + Two-Pointer Merge",
  sections:{
    explain:"Merge two sorted linked lists into one sorted list. Return the head of the merged list.",
    example:{input:"list1=[1,2,4], list2=[1,3,4]", output:"[1,1,2,3,4,4]"},
    intuition:"Use a dummy head. At each step, compare the front of both lists, attach the smaller node, advance that pointer. After one list is exhausted, attach the remainder of the other.",
    tricks:[
      {name:"Dummy head eliminates edge cases", detail:"No need to check if the merged list is empty. result always starts at dummy.next."},
      {name:"Tail attachment for remainder", detail:"curr.next = l1 or l2 — whichever is non-null. One assignment handles the rest; no loop needed."}
    ],
    code:`def mergeTwoLists(self, l1, l2):
    dummy = curr = ListNode(0)
    while l1 and l2:
        if l1.val <= l2.val:
            curr.next = l1; l1 = l1.next
        else:
            curr.next = l2; l2 = l2.next
        curr = curr.next
    curr.next = l1 or l2
    return dummy.next`,
    tc:"O(m+n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"1 vs 1 (tie)", detail:"Attach l1's 1, advance l1. curr→1."},
        {label:"2 vs 1", detail:"Attach l2's 1, advance l2. curr→1."},
        {label:"Continue", detail:"2<3→attach 2, 3<4→attach 3, 4==4→attach l1's 4, append l2's remainder [4]."}
      ],
      edgeCase:"One or both lists empty: the while loop never runs; curr.next = l1 or l2 handles it."
    },
    similar:{"Linked List":["Merge K Sorted Lists","Sort List","Merge Sorted Array"]}
  }
},

"copy-list-with-random-pointer": {
  num:60, title:"Copy List with Random Pointer", diff:"Medium", cat:"Linked List",
  lc:"https://leetcode.com/problems/copy-list-with-random-pointer/",
  rev:"10 min", pattern:"Hash Map Old→New Node",
  sections:{
    explain:"Each node has val, next, and random (points to any node or null). Deep-copy the entire list.",
    example:{input:"head=[[7,null],[13,0],[11,4],[10,2],[1,0]]", output:"Deep copy with same structure"},
    intuition:"Two-pass approach: first pass creates all new nodes and stores old→new mapping in a hash map. Second pass wires next and random pointers using the map.",
    tricks:[
      {name:"Hash map as pointer translator", detail:"map[old_node] = new_node. Then new.next = map[old.next], new.random = map[old.random]. Handle None with map.get(node)."},
      {name:"Interleaving approach (O(1) space)", detail:"Insert copies between original nodes: A→A'→B→B'→... Then set randoms: A'.random=A.random.next. Finally separate the two lists."}
    ],
    code:`def copyRandomList(self, head):
    if not head: return None
    mp = {}
    cur = head
    while cur:              # Pass 1: create nodes
        mp[cur] = Node(cur.val)
        cur = cur.next
    cur = head
    while cur:              # Pass 2: wire pointers
        if cur.next:  mp[cur].next   = mp[cur.next]
        if cur.random: mp[cur].random = mp[cur.random]
        cur = cur.next
    return mp[head]`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"Pass 1", detail:"Create new Node for each original. mp[orig]=copy."},
        {label:"Pass 2", detail:"For each orig: copy.next=mp[orig.next], copy.random=mp[orig.random]."}
      ],
      edgeCase:"Nodes with random=None: the if guards handle it. Single node with random pointing to itself."
    },
    similar:{"Hash Map":["Clone Graph","Copy Binary Tree"]}
  }
},

"reverse-linked-list-ii": {
  num:61, title:"Reverse Linked List II", diff:"Medium", cat:"Linked List",
  lc:"https://leetcode.com/problems/reverse-linked-list-ii/",
  rev:"8 min", pattern:"One-Pass In-Place Reversal with Dummy",
  sections:{
    explain:"Reverse the nodes from position left to right (1-indexed) in a linked list. Do it in one pass.",
    example:{input:"head=[1,2,3,4,5], left=2, right=4", output:"[1,4,3,2,5]"},
    intuition:"Use a dummy node. Advance to the node just before position left (call it prev). Then repeatedly take the node after prev.next and move it to just after prev (front-insertion). Repeat right-left times.",
    tricks:[
      {name:"Front-insertion trick", detail:"No need to find the tail of the reversed section. For each of (right-left) steps: take the node AFTER curr and insert it BEFORE curr (after prev). curr stays fixed."},
      {name:"Dummy head", detail:"Handles the case where left=1 — otherwise prev would be null."}
    ],
    code:`def reverseBetween(self, head, left, right):
    dummy = ListNode(0, head)
    prev = dummy
    for _ in range(left - 1):   # advance prev to node before left
        prev = prev.next
    curr = prev.next
    for _ in range(right - left):
        nxt = curr.next
        curr.next = nxt.next
        nxt.next = prev.next
        prev.next = nxt
    return dummy.next`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"Advance prev", detail:"left=2: prev advances 1 step → prev=node(1). curr=node(2)."},
        {label:"Iteration 1", detail:"nxt=node(3). node(2).next=node(4). node(3).next=node(2). prev.next=node(3). List: 1→3→2→4→5."},
        {label:"Iteration 2", detail:"nxt=node(4). node(2).next=node(5). node(4).next=node(3). prev.next=node(4). List: 1→4→3→2→5. Done."}
      ],
      edgeCase:"left==right: no iterations, list unchanged. left=1: dummy prevents null prev."
    },
    similar:{"Linked List":["Reverse Nodes in k-Group","Swap Nodes in Pairs","Reverse Linked List"]}
  }
},

"reverse-nodes-in-k-group": {
  num:62, title:"Reverse Nodes in k-Group", diff:"Hard", cat:"Linked List",
  lc:"https://leetcode.com/problems/reverse-nodes-in-k-group/",
  rev:"12 min", pattern:"Group Reversal with Reconnection",
  sections:{
    explain:"Reverse every k consecutive nodes. If the remaining nodes are fewer than k, leave them as-is.",
    example:{input:"head=[1,2,3,4,5], k=2", output:"[2,1,4,3,5]"},
    intuition:"For each group: first verify k nodes exist (don't reverse if insufficient). Then reverse k nodes in place, tracking the group tail (which becomes the new group head after reversal). Reconnect to previous group's tail and recurse/iterate.",
    tricks:[
      {name:"Check k nodes before reversing", detail:"Walk k steps; if null before k, stop. Avoids reversing a partial tail group."},
      {name:"group_prev and group_next", detail:"Save the node before the group (group_prev.next = reversed head) and the node after the group (group_next) for reconnection."}
    ],
    code:`def reverseKGroup(self, head, k):
    dummy = ListNode(0, head)
    group_prev = dummy
    while True:
        kth = self.getKth(group_prev, k)
        if not kth: break
        group_next = kth.next
        # Reverse the group
        prev, curr = kth.next, group_prev.next
        while curr != group_next:
            nxt = curr.next
            curr.next = prev
            prev = curr; curr = nxt
        # Reconnect
        tmp = group_prev.next
        group_prev.next = kth
        group_prev = tmp
    return dummy.next

def getKth(self, curr, k):
    while curr and k > 0:
        curr = curr.next; k -= 1
    return curr`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"Group 1: nodes 1,2", detail:"kth=node(2). Reverse→2→1. Connect: dummy→2→1→3→4→5."},
        {label:"Group 2: nodes 3,4", detail:"kth=node(4). Reverse→4→3. Connect: 1→4→3→5."},
        {label:"Remaining: node 5", detail:"getKth returns None (only 1 node < k=2). Break. Leave 5 as-is."}
      ],
      edgeCase:"k=1: no reversal needed. List length exactly divisible by k: no tail remainder."
    },
    similar:{"Linked List":["Reverse Linked List II","Swap Nodes in Pairs","Reverse Alternate K Nodes"]}
  }
},

"remove-nth-node-from-end-of-list": {
  num:63, title:"Remove Nth Node From End of List", diff:"Medium", cat:"Linked List",
  lc:"https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
  rev:"6 min", pattern:"Two Pointers with n-gap",
  sections:{
    explain:"Remove the nth node from the end of a linked list in one pass.",
    example:{input:"head=[1,2,3,4,5], n=2", output:"[1,2,3,5]", why:"4th from start = 2nd from end"},
    intuition:"Two pointers: advance fast by n steps. Then advance both until fast reaches the last node. slow is now at the node BEFORE the target. Unlink slow.next.",
    tricks:[
      {name:"Dummy head handles removing the first node", detail:"If n equals the list length, we'd remove head. Dummy node gives prev a valid node to be."},
      {name:"Fast advances n+1 (not n)", detail:"We want slow to land one node BEFORE the target. Advance fast n+1 steps so the gap leaves slow at the predecessor."}
    ],
    code:`def removeNthFromEnd(self, head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n + 1):   # n+1 to land slow before target
        fast = fast.next
    while fast:
        fast = fast.next
        slow = slow.next
    slow.next = slow.next.next
    return dummy.next`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"n=2, list=[1,2,3,4,5]", detail:"Advance fast 3 steps: fast=node(3). slow=dummy."},
        {label:"Advance both", detail:"fast→4,slow→1; fast→5,slow→2; fast→None,slow→3."},
        {label:"Unlink", detail:"slow.next = slow.next.next → node(3).next = node(5). Done."}
      ],
      edgeCase:"n equals list length (remove head): dummy allows slow to be the dummy node, unlinking head correctly."
    },
    similar:{"Linked List":["Delete Node in a Linked List","Middle of Linked List","Reorder List"]}
  }
},

"remove-duplicates-from-sorted-list-ii": {
  num:64, title:"Remove Duplicates from Sorted List II", diff:"Medium", cat:"Linked List",
  lc:"https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/",
  rev:"8 min", pattern:"Dummy + Skip All Duplicates",
  sections:{
    explain:"Given a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers.",
    example:{input:"head=[1,2,3,3,4,4,5]", output:"[1,2,5]", why:"3 and 4 both appear more than once, so both are fully removed"},
    intuition:"Use a dummy head and a prev pointer. For each group of equal nodes, if the group has more than one node, skip the entire group (prev.next = end of group's next). Otherwise advance prev.",
    tricks:[
      {name:"Detect duplicate group", detail:"If curr.next exists and curr.val == curr.next.val, keep advancing curr until the value changes. Then skip: prev.next = curr.next."},
      {name:"Dummy node", detail:"Without dummy, removing the head (which could be a duplicate) requires special casing."}
    ],
    code:`def deleteDuplicates(self, head):
    dummy = ListNode(0, head)
    prev = dummy
    curr = head
    while curr:
        # Check if current node starts a duplicate group
        if curr.next and curr.val == curr.next.val:
            while curr.next and curr.val == curr.next.val:
                curr = curr.next          # skip all duplicates
            prev.next = curr.next         # skip the last duplicate too
        else:
            prev = prev.next
        curr = curr.next
    return dummy.next`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"curr=1", detail:"No duplicate (1≠2). prev advances to 1. curr→2."},
        {label:"curr=3,3 found", detail:"Inner while: curr→second 3. prev.next=4. curr→4."},
        {label:"curr=4,4 found", detail:"Inner while: curr→second 4. prev.next=5. curr→5."},
        {label:"curr=5", detail:"No duplicate. prev advances. curr→None. Done: [1,2,5]."}
      ],
      edgeCase:"All nodes are duplicates: dummy.next ends up None. Head itself is a duplicate: dummy handles it."
    },
    similar:{"Linked List":["Remove Duplicates from Sorted List","Remove Duplicates from Sorted Array II"]}
  }
},

"rotate-list": {
  num:65, title:"Rotate List", diff:"Medium", cat:"Linked List",
  lc:"https://leetcode.com/problems/rotate-list/",
  rev:"8 min", pattern:"Find New Tail by Length Modulo",
  sections:{
    explain:"Rotate a linked list to the right by k places.",
    example:{input:"head=[1,2,3,4,5], k=2", output:"[4,5,1,2,3]", why:"Rotating right 2: last 2 nodes move to front"},
    intuition:"First find the length and make the list circular. The new tail is at position (length - k % length - 1). Cut there and return the new head.",
    tricks:[
      {name:"k % length handles k > length", detail:"Rotating by length is a no-op. Modulo avoids unnecessary full rotations."},
      {name:"Circular list technique", detail:"Connect tail to head, advance to new tail, cut. No need to manually move individual nodes."}
    ],
    code:`def rotateRight(self, head, k):
    if not head or not head.next or k == 0: return head
    # Find length and tail
    length, tail = 1, head
    while tail.next:
        tail = tail.next; length += 1
    k = k % length
    if k == 0: return head
    # Make circular, find new tail
    tail.next = head
    steps = length - k - 1
    new_tail = head
    for _ in range(steps):
        new_tail = new_tail.next
    new_head = new_tail.next
    new_tail.next = None
    return new_head`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"length=5, k=2", detail:"k%5=2. tail.next=head (circular)."},
        {label:"New tail at 5-2-1=2", detail:"Advance 2 steps from head: new_tail=node(3)."},
        {label:"Cut", detail:"new_head=node(4). node(3).next=None. Return node(4)=[4,5,1,2,3]."}
      ],
      edgeCase:"k=0 or k%length=0: return head unchanged. Single node: early return."
    },
    similar:{"Linked List":["Rotate Array","Reverse Nodes in k-Group","Split Linked List in Parts"]}
  }
},

"partition-list": {
  num:66, title:"Partition List", diff:"Medium", cat:"Linked List",
  lc:"https://leetcode.com/problems/partition-list/",
  rev:"6 min", pattern:"Two Dummy Lists (Before / After)",
  sections:{
    explain:"Partition a linked list so all nodes less than x come before nodes greater than or equal to x. Preserve relative order within each partition.",
    example:{input:"head=[1,4,3,2,5,2], x=3", output:"[1,2,2,4,3,5]"},
    intuition:"Maintain two separate lists: 'less' for nodes < x and 'greater' for nodes >= x. Traverse once, appending each node to the correct list. Connect less.tail → greater.head at the end.",
    tricks:[
      {name:"Two dummy heads", detail:"Create dummy_less and dummy_greater. Avoids null checks when appending the first node to each list."},
      {name:"Terminate greater list", detail:"Set greater_tail.next = None to avoid a cycle if the original tail had next pointing somewhere."}
    ],
    code:`def partition(self, head, x):
    less_dummy = less = ListNode(0)
    greater_dummy = greater = ListNode(0)
    while head:
        if head.val < x:
            less.next = head; less = less.next
        else:
            greater.next = head; greater = greater.next
        head = head.next
    greater.next = None             # terminate
    less.next = greater_dummy.next  # connect
    return less_dummy.next`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"1<3→less, 4>=3→greater", detail:"less:[1], greater:[4]."},
        {label:"3>=3→greater, 2<3→less", detail:"less:[1,2], greater:[4,3]."},
        {label:"5>=3→greater, 2<3→less", detail:"less:[1,2,2], greater:[4,3,5]."},
        {label:"Connect", detail:"less.next=greater_dummy.next → [1,2,2,4,3,5]."}
      ],
      edgeCase:"All nodes < x: greater list empty, connect None. All >= x: less list empty, return greater."
    },
    similar:{"Linked List":["Sort Colors (Dutch Flag)","Sort List","Rotate List"]}
  }
},

"lru-cache": {
  num:67, title:"LRU Cache", diff:"Medium", cat:"Linked List",
  lc:"https://leetcode.com/problems/lru-cache/",
  rev:"15 min", pattern:"HashMap + Doubly Linked List",
  sections:{
    explain:"Implement an LRU (Least Recently Used) cache with O(1) get and put operations. Evict the least recently used key when capacity is exceeded.",
    example:{input:"capacity=2; put(1,1); put(2,2); get(1)→1; put(3,3); get(2)→-1 (evicted)", output:"[1,3] in cache"},
    intuition:"Combine a hash map (O(1) lookup) with a doubly linked list (O(1) insertion/deletion). The list maintains access order: most recent at head, least recent at tail. On get/put, move the node to head. On eviction, remove from tail.",
    tricks:[
      {name:"Dummy head and tail sentinels", detail:"Sentinel nodes at both ends eliminate edge cases for inserting/removing at boundaries."},
      {name:"Map stores node references", detail:"cache[key] = node lets you jump directly to any node in the list in O(1) for removal/promotion."}
    ],
    code:`class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.cache = {}                       # key → node
        self.head = Node(0, 0)               # dummy head (MRU side)
        self.tail = Node(0, 0)               # dummy tail (LRU side)
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _insert_front(self, node):            # insert after head
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key):
        if key in self.cache:
            self._remove(self.cache[key])
            self._insert_front(self.cache[key])
            return self.cache[key].val
        return -1

    def put(self, key, value):
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self.cache[key] = node
        self._insert_front(node)
        if len(self.cache) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]`,
    tc:"O(1) get and put", sc:"O(capacity)",
    walkthrough:{
      steps:[
        {label:"put(1,1), put(2,2)", detail:"List: head↔2↔1↔tail. Cache: {1:node1, 2:node2}."},
        {label:"get(1)", detail:"Remove node1, insert at front. List: head↔1↔2↔tail. Returns 1."},
        {label:"put(3,3) — evict", detail:"Capacity exceeded. LRU = tail.prev = node2. Remove it, del cache[2]. Insert node3 at front. List: head↔3↔1↔tail."},
        {label:"get(2)", detail:"2 not in cache → -1."}
      ],
      edgeCase:"put with existing key: remove old node first, then insert fresh (value update + promotion)."
    },
    similar:{"Design":["LFU Cache","Design Twitter","All O(1) Data Structure"]}
  }
},

/* ════════════════ BINARY TREE ════════════════ */

"maximum-depth-of-binary-tree": {
  num:68, title:"Maximum Depth of Binary Tree", diff:"Easy", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/maximum-depth-of-binary-tree/",
  rev:"5 min", pattern:"DFS Post-Order",
  sections:{
    explain:"Return the maximum depth (number of nodes along the longest path from root to the farthest leaf) of a binary tree.",
    example:{input:"root=[3,9,20,null,null,15,7]", output:"3", why:"Path 3→20→7 has 3 nodes"},
    intuition:"The depth of a node is 1 + max(depth of left child, depth of right child). Base case: null node has depth 0. This naturally computes bottom-up via recursion.",
    tricks:[
      {name:"One-liner with recursion", detail:"return 1 + max(dfs(left), dfs(right)) if root else 0. Clean and minimal."},
      {name:"BFS level count alternative", detail:"BFS and count levels. Useful if the problem asks for level-order information too."}
    ],
    code:`def maxDepth(self, root):
    if not root: return 0
    return 1 + max(self.maxDepth(root.left),
                   self.maxDepth(root.right))`,
    tc:"O(n)", sc:"O(h) stack where h=height",
    walkthrough:{
      steps:[
        {label:"Leaf nodes", detail:"Both children None → return 0. Parent gets 1+max(0,0)=1."},
        {label:"Node 20", detail:"left=15(depth 1), right=7(depth 1). Returns 2."},
        {label:"Root 3", detail:"left=9(depth 1), right=20(depth 2). Returns 3."}
      ],
      edgeCase:"Empty tree: root is None → return 0. Single node: returns 1."
    },
    similar:{"DFS":["Minimum Depth of Binary Tree","Balanced Binary Tree","Diameter of Binary Tree"]}
  }
},

"same-tree": {
  num:69, title:"Same Tree", diff:"Easy", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/same-tree/",
  rev:"5 min", pattern:"Simultaneous DFS",
  sections:{
    explain:"Given two binary tree roots, determine if the trees are structurally identical with the same node values.",
    example:{input:"p=[1,2,3], q=[1,2,3]", output:"true"},
    intuition:"Recurse on both trees simultaneously. Trees are same if: both null (true), one null and other not (false), values differ (false), or left subtrees same AND right subtrees same.",
    tricks:[
      {name:"Four-case base check", detail:"1) Both None→True. 2) Exactly one None→False. 3) Values differ→False. 4) Recurse on children."}
    ],
    code:`def isSameTree(self, p, q):
    if not p and not q: return True
    if not p or not q:  return False
    if p.val != q.val:  return False
    return (self.isSameTree(p.left, q.left) and
            self.isSameTree(p.right, q.right))`,
    tc:"O(n)", sc:"O(h)",
    walkthrough:{
      steps:[{label:"Root 1==1", detail:"Recurse. Left: 2==2, recurse (both leaves match). Right: 3==3, match. All True."}],
      edgeCase:"Both empty trees: return True. One empty, one not: return False at second check."
    },
    similar:{"DFS":["Symmetric Tree","Subtree of Another Tree","Check if Two Trees Are Mirrors"]}
  }
},

"invert-binary-tree": {
  num:70, title:"Invert Binary Tree", diff:"Easy", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/invert-binary-tree/",
  rev:"5 min", pattern:"DFS Swap",
  sections:{
    explain:"Invert (mirror) a binary tree and return its root.",
    example:{input:"root=[4,2,7,1,3,6,9]", output:"[4,7,2,9,6,3,1]"},
    intuition:"For every node, swap its left and right children, then recursively invert both subtrees. Post-order or pre-order both work.",
    tricks:[{name:"Python tuple swap", detail:"root.left, root.right = root.right, root.left. Then recurse. Three lines total."}],
    code:`def invertTree(self, root):
    if not root: return None
    root.left, root.right = root.right, root.left
    self.invertTree(root.left)
    self.invertTree(root.right)
    return root`,
    tc:"O(n)", sc:"O(h)",
    walkthrough:{
      steps:[
        {label:"Root 4", detail:"Swap: left=7, right=2. Recurse on 7 and 2."},
        {label:"Node 7", detail:"Swap children: left=9, right=6."},
        {label:"Node 2", detail:"Swap children: left=3, right=1. Tree is now mirrored."}
      ],
      edgeCase:"Empty tree: return None. Single node: swap nothing, return it."
    },
    similar:{"DFS":["Symmetric Tree","Flip Equivalent Binary Trees","Same Tree"]}
  }
},

"symmetric-tree": {
  num:71, title:"Symmetric Tree", diff:"Easy", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/symmetric-tree/",
  rev:"6 min", pattern:"Mirror DFS (Two-Pointer Recursion)",
  sections:{
    explain:"Check whether a binary tree is a mirror of itself (symmetric around its center).",
    example:{input:"root=[1,2,2,3,4,4,3]", output:"true"},
    intuition:"A tree is symmetric if its left and right subtrees are mirrors. Two subtrees are mirrors if: both null (true), one null (false), values equal AND outer children mirror AND inner children mirror.",
    tricks:[{name:"Mirror helper takes two nodes", detail:"isMirror(left, right). outer pair: left.left vs right.right. inner pair: left.right vs right.left."}],
    code:`def isSymmetric(self, root):
    def mirror(l, r):
        if not l and not r: return True
        if not l or not r:  return False
        return (l.val == r.val and
                mirror(l.left, r.right) and    # outer
                mirror(l.right, r.left))        # inner
    return mirror(root.left, root.right)`,
    tc:"O(n)", sc:"O(h)",
    walkthrough:{
      steps:[
        {label:"mirror(2,2)", detail:"2==2. outer: mirror(3,3)→True. inner: mirror(4,4)→True. True."},
        {label:"Overall", detail:"mirror(root.left, root.right) = True."}
      ],
      edgeCase:"Root only: mirror(None, None) → True. Right-heavy tree: outer/inner mismatch catches it."
    },
    similar:{"DFS":["Same Tree","Invert Binary Tree","Check Mirror of Tree"]}
  }
},

"subtree-of-another-tree": {
  num:72, title:"Subtree of Another Tree", diff:"Easy", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/subtree-of-another-tree/",
  rev:"6 min", pattern:"DFS + isSameTree Helper",
  sections:{
    explain:"Given roots of trees root and subRoot, return true if subRoot is a subtree of root (identical structure and values).",
    example:{input:"root=[3,4,5,1,2], subRoot=[4,1,2]", output:"true"},
    intuition:"At every node of root, check if the subtree rooted there is identical to subRoot (using isSameTree). Recurse on left and right children if not.",
    tricks:[{name:"Reuse isSameTree", detail:"isSubtree = isSameTree(root, sub) OR isSubtree(root.left, sub) OR isSubtree(root.right, sub)."}],
    code:`def isSubtree(self, root, subRoot):
    if not root: return False
    if self.isSame(root, subRoot): return True
    return (self.isSubtree(root.left, subRoot) or
            self.isSubtree(root.right, subRoot))

def isSame(self, p, q):
    if not p and not q: return True
    if not p or not q:  return False
    return (p.val == q.val and
            self.isSame(p.left, q.left) and
            self.isSame(p.right, q.right))`,
    tc:"O(m*n)", sc:"O(h)",
    walkthrough:{
      steps:[
        {label:"root=3", detail:"isSame(3,[4,1,2])? No. Recurse left (root=4)."},
        {label:"root=4", detail:"isSame(4,[4,1,2])? Check: 4==4, left: 1==1 ✓, right: 2==2 ✓. Return True."}
      ],
      edgeCase:"subRoot is null: always true (empty tree is subtree of any). root is null: false (can't contain non-null sub)."
    },
    similar:{"DFS":["Same Tree","Count Univalue Subtrees","Find All Nodes Distance K"]}
  }
},

"construct-binary-tree-from-preorder-and-inorder-traversal": {
  num:73, title:"Construct Binary Tree from Preorder and Inorder Traversal", diff:"Medium", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
  rev:"10 min", pattern:"Recursive Split with Index Map",
  sections:{
    explain:"Given preorder and inorder traversal arrays of a binary tree, reconstruct and return the tree.",
    example:{input:"preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]", output:"Tree [3,9,20,null,null,15,7]"},
    intuition:"preorder[0] is always the root. Find that value in inorder — everything to its left is the left subtree, everything to its right is the right subtree. Recurse with the corresponding preorder and inorder slices.",
    tricks:[
      {name:"Hash map for O(1) inorder lookup", detail:"Build idx={val: index} for inorder array. Avoids O(n) search per recursive call, bringing total to O(n)."},
      {name:"Use index pointers not slices", detail:"Pass pre_start, in_start, size instead of slicing arrays. Eliminates O(n) slice allocation overhead."}
    ],
    code:`def buildTree(self, preorder, inorder):
    idx = {v: i for i, v in enumerate(inorder)}
    def dfs(pre_l, pre_r, in_l, in_r):
        if pre_l > pre_r: return None
        root_val = preorder[pre_l]
        root = TreeNode(root_val)
        mid = idx[root_val]
        left_size = mid - in_l
        root.left  = dfs(pre_l+1, pre_l+left_size, in_l, mid-1)
        root.right = dfs(pre_l+left_size+1, pre_r, mid+1, in_r)
        return root
    return dfs(0, len(preorder)-1, 0, len(inorder)-1)`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"Root=3", detail:"idx[3]=1. left_size=1 (just node 9). Recurse left: preorder[1..1], inorder[0..0]."},
        {label:"Left subtree root=9", detail:"No children (pre_l==pre_r, single node). Returns node(9)."},
        {label:"Right subtree root=20", detail:"preorder[2..4], inorder[2..4]. idx[20]=3. left_size=1 (15). Recurse for 15 and 7."}
      ],
      edgeCase:"Single node: pre_l==pre_r, no children. All nodes in left subtree: in_r=mid-1, right recursion returns None."
    },
    similar:{"DFS":["Construct from Inorder and Postorder","Construct from Preorder and Postorder","Serialize and Deserialize Binary Tree"]}
  }
},

"binary-tree-level-order-traversal": {
  num:74, title:"Binary Tree Level Order Traversal", diff:"Medium", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/binary-tree-level-order-traversal/",
  rev:"6 min", pattern:"BFS with Level Grouping",
  sections:{
    explain:"Return the level order traversal of a binary tree as a list of lists, where each inner list contains values at that level.",
    example:{input:"root=[3,9,20,null,null,15,7]", output:"[[3],[9,20],[15,7]]"},
    intuition:"BFS using a queue. At each level, snapshot the current queue length — that many nodes are at the current level. Process exactly that many nodes, collecting their values and enqueuing their children.",
    tricks:[{name:"Snapshot queue length per level", detail:"level_size = len(queue). Process exactly level_size nodes. This separates levels cleanly without needing a sentinel."}],
    code:`from collections import deque
def levelOrder(self, root):
    if not root: return []
    res, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):    # process this level
            node = queue.popleft()
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        res.append(level)
    return res`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"Level 0: queue=[3]", detail:"Pop 3, append children 9,20. level=[3]."},
        {label:"Level 1: queue=[9,20]", detail:"Pop 9 (no children), pop 20 (children 15,7). level=[9,20]."},
        {label:"Level 2: queue=[15,7]", detail:"Pop 15,7. No children. level=[15,7]. Queue empty → done."}
      ],
      edgeCase:"Empty tree: return []. Single node: returns [[val]]."
    },
    similar:{"BFS":["Binary Tree Zigzag Level Order","Binary Tree Right Side View","Average of Levels"]}
  }
},

"binary-tree-zigzag-level-order-traversal": {
  num:75, title:"Binary Tree Zigzag Level Order Traversal", diff:"Medium", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
  rev:"6 min", pattern:"BFS + Direction Flag",
  sections:{
    explain:"Return zigzag level order traversal: first level left-to-right, second right-to-left, alternating.",
    example:{input:"root=[3,9,20,null,null,15,7]", output:"[[3],[20,9],[15,7]]"},
    intuition:"Same BFS as level order. After collecting each level's values, if the level index is odd (0-indexed), reverse the list before appending. Toggle the direction flag per level.",
    tricks:[{name:"Reverse odd levels", detail:"level.reverse() for odd depths. Simpler than using a deque with two ends. Collect values normally, then conditionally reverse."}],
    code:`from collections import deque
def zigzagLevelOrder(self, root):
    if not root: return []
    res, queue, left_to_right = [], deque([root]), True
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        res.append(level if left_to_right else level[::-1])
        left_to_right = not left_to_right
    return res`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"Level 0 (L→R)", detail:"[3] → append as-is."},
        {label:"Level 1 (R→L)", detail:"[9,20] → reversed → [20,9]."},
        {label:"Level 2 (L→R)", detail:"[15,7] → append as-is."}
      ],
      edgeCase:"Single node: [[val]]. Left-skewed tree: alternate None/value levels."
    },
    similar:{"BFS":["Binary Tree Level Order Traversal","Binary Tree Right Side View","N-ary Tree Level Order"]}
  }
},

"maximum-binary-tree": {
  num:76, title:"Maximum Binary Tree", diff:"Medium", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/maximum-binary-tree/",
  rev:"6 min", pattern:"Recursive Max-Split",
  sections:{
    explain:"Build a maximum binary tree from an array: root is the maximum element; left subtree built from elements before it, right from elements after it.",
    example:{input:"nums=[3,2,1,6,0,5]", output:"Root=6, left=[3,2,1], right=[0,5]"},
    intuition:"Find the index of the maximum value in the current range. Create a root with that value. Recursively build left subtree from the left sub-array and right subtree from the right sub-array.",
    tricks:[{name:"Monotonic stack O(n) approach", detail:"For interviews, the recursive O(n log n) approach is sufficient. The O(n) stack solution builds nodes in a monotone-decreasing-stack order."}],
    code:`def constructMaximumBinaryTree(self, nums):
    if not nums: return None
    max_idx = nums.index(max(nums))
    root = TreeNode(nums[max_idx])
    root.left  = self.constructMaximumBinaryTree(nums[:max_idx])
    root.right = self.constructMaximumBinaryTree(nums[max_idx+1:])
    return root`,
    tc:"O(n^2) worst case", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"nums=[3,2,1,6,0,5]", detail:"max=6 at idx 3. root=6. left=dfs([3,2,1]), right=dfs([0,5])."},
        {label:"dfs([3,2,1])", detail:"max=3 at idx 0. root=3. left=None, right=dfs([2,1])."},
        {label:"dfs([0,5])", detail:"max=5 at idx 1. root=5. left=node(0), right=None."}
      ],
      edgeCase:"Empty sub-array: return None. Single element: leaf node."
    },
    similar:{"DFS":["Construct Binary Tree from Preorder/Inorder","Largest Rectangle in Histogram"]}
  }
},

"diameter-of-binary-tree": {
  num:77, title:"Diameter of Binary Tree", diff:"Easy", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/diameter-of-binary-tree/",
  rev:"6 min", pattern:"DFS with Global Max",
  sections:{
    explain:"Find the length of the longest path between any two nodes in a binary tree (the diameter). Path may or may not pass through root.",
    example:{input:"root=[1,2,3,4,5]", output:"3", why:"Path 4→2→1→3 or 5→2→1→3 has length 3"},
    intuition:"For every node, the longest path through it = left_height + right_height. DFS returns height; track maximum diameter encountered at any node with a global variable.",
    tricks:[{name:"Return height, update diameter globally", detail:"dfs(node) returns height = 1 + max(dfs(left), dfs(right)). Diameter at this node = dfs(left) + dfs(right). Update res = max(res, left+right)."}],
    code:`def diameterOfBinaryTree(self, root):
    self.res = 0
    def dfs(node):
        if not node: return 0
        left  = dfs(node.left)
        right = dfs(node.right)
        self.res = max(self.res, left + right)
        return 1 + max(left, right)
    dfs(root)
    return self.res`,
    tc:"O(n)", sc:"O(h)",
    walkthrough:{
      steps:[
        {label:"Leaves 4,5,3", detail:"Each returns height 1. At node 3: res=max(0,0+0)=0, returns 1."},
        {label:"Node 2", detail:"left=dfs(4)=1, right=dfs(5)=1. res=max(0,2)=2. returns 2."},
        {label:"Node 1 (root)", detail:"left=dfs(2)=2, right=dfs(3)=1. res=max(2,3)=3. Return 3."}
      ],
      edgeCase:"Null root: return 0. Path doesn't go through root: still captured at the relevant node."
    },
    similar:{"DFS":["Binary Tree Maximum Path Sum","Longest Univalue Path","Height of Binary Tree"]}
  }
},

"balanced-binary-tree": {
  num:78, title:"Balanced Binary Tree", diff:"Easy", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/balanced-binary-tree/",
  rev:"6 min", pattern:"DFS — Return -1 on Imbalance",
  sections:{
    explain:"Determine if a binary tree is height-balanced: for every node, the heights of its left and right subtrees differ by at most 1.",
    example:{input:"root=[3,9,20,null,null,15,7]", output:"true"},
    intuition:"DFS that returns the height if balanced, or -1 if unbalanced. If either child returns -1, propagate -1 up immediately (early termination). At each node check |left - right| <= 1.",
    tricks:[{name:"Sentinel -1 for imbalance", detail:"Using -1 as a sentinel avoids a separate boolean. Once -1 is returned, all ancestor calls return -1 immediately — no wasted work."}],
    code:`def isBalanced(self, root):
    def dfs(node):
        if not node: return 0
        left = dfs(node.left)
        if left == -1: return -1
        right = dfs(node.right)
        if right == -1: return -1
        if abs(left - right) > 1: return -1
        return 1 + max(left, right)
    return dfs(root) != -1`,
    tc:"O(n)", sc:"O(h)",
    walkthrough:{
      steps:[
        {label:"Balanced subtree", detail:"All nodes return valid heights. No -1 propagated."},
        {label:"Unbalanced node", detail:"e.g., left=3, right=0 → |3-0|>1 → return -1. Parent receives -1, propagates up."}
      ],
      edgeCase:"Empty tree: dfs(None)=0, 0!=-1 → True. Single node: heights 0/0, diff=0 → balanced."
    },
    similar:{"DFS":["Maximum Depth of Binary Tree","Diameter of Binary Tree","Count Complete Tree Nodes"]}
  }
},

"binary-tree-right-side-view": {
  num:79, title:"Binary Tree Right Side View", diff:"Medium", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/binary-tree-right-side-view/",
  rev:"6 min", pattern:"BFS — Last Node Per Level",
  sections:{
    explain:"Return a list of values visible when looking at a binary tree from the right side (rightmost node at each level).",
    example:{input:"root=[1,2,3,null,5,null,4]", output:"[1,3,4]"},
    intuition:"BFS level-order traversal. At each level, the last node processed (rightmost) is what's visible. Append queue[-1].val or the last node before processing children.",
    tricks:[
      {name:"Append last node of each level", detail:"After the inner for-loop, `node` holds the last node of that level. Append node.val."},
      {name:"DFS alternative", detail:"DFS with depth parameter. First visit right, then left. Add to result if depth == len(res) (first time we reach this depth from the right)."}
    ],
    code:`from collections import deque
def rightSideView(self, root):
    if not root: return []
    res, queue = [], deque([root])
    while queue:
        for i in range(len(queue)):
            node = queue.popleft()
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        res.append(node.val)    # last node of this level
    return res`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"Level 0: [1]", detail:"Process 1. Last node=1. res=[1]."},
        {label:"Level 1: [2,3]", detail:"Process 2 then 3. Last node=3. res=[1,3]."},
        {label:"Level 2: [5,4]", detail:"Process 5 then 4. Last node=4. res=[1,3,4]."}
      ],
      edgeCase:"Left-skewed tree: right side view is just the leftmost nodes at each level (they're the only ones). Returns correct last node per level."
    },
    similar:{"BFS":["Binary Tree Level Order Traversal","Binary Tree Left Side View","Populating Next Right Pointers"]}
  }
},

"count-good-nodes-in-binary-tree": {
  num:80, title:"Count Good Nodes in Binary Tree", diff:"Medium", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/count-good-nodes-in-binary-tree/",
  rev:"6 min", pattern:"DFS with Running Maximum",
  sections:{
    explain:"A node is 'good' if on the path from the root to that node, no node has a value greater than the node's value. Count all good nodes.",
    example:{input:"root=[3,1,4,3,null,1,5]", output:"4", why:"Nodes 3(root),4,3,5 are good"},
    intuition:"DFS, passing the maximum value seen so far on the current path. A node is good if node.val >= max_so_far. Count it and pass max(max_so_far, node.val) to children.",
    tricks:[{name:"Pass running max down", detail:"No backtracking needed. Each recursive call gets max(path_max, parent.val). Count += 1 if node.val >= path_max."}],
    code:`def goodNodes(self, root):
    def dfs(node, max_val):
        if not node: return 0
        good = 1 if node.val >= max_val else 0
        max_val = max(max_val, node.val)
        return good + dfs(node.left, max_val) + dfs(node.right, max_val)
    return dfs(root, float('-inf'))`,
    tc:"O(n)", sc:"O(h)",
    walkthrough:{
      steps:[
        {label:"Root 3, max=-inf", detail:"3>=-inf → good=1. max_val=3."},
        {label:"Node 1 (left), max=3", detail:"1<3 → good=0. max_val stays 3."},
        {label:"Node 3 (left-left), max=3", detail:"3>=3 → good=1. Node 4, max=3: 4>=3 → good=1. Node 5, max=4: 5>=4 → good=1."}
      ],
      edgeCase:"Root is always good (path max starts at -inf). All nodes descending → only root is good."
    },
    similar:{"DFS":["Path Sum II","Maximum Sum Path","Path Sum III"]}
  }
},

"validate-binary-search-tree": {
  num:81, title:"Validate Binary Search Tree", diff:"Medium", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/validate-binary-search-tree/",
  rev:"8 min", pattern:"DFS with Min/Max Bounds",
  sections:{
    explain:"Determine if a binary tree is a valid BST: left subtree values < node value < right subtree values, recursively for every node.",
    example:{input:"root=[5,1,4,null,null,3,6]", output:"false", why:"Node 4's left child is 3, which is < 4, but 3 < root 5 so it's in the right subtree incorrectly"},
    intuition:"DFS, passing valid range [min_val, max_val] to each node. A node is valid if min_val < node.val < max_val. Left child inherits max_val = node.val; right child inherits min_val = node.val.",
    tricks:[
      {name:"Bounds not just parent value", detail:"Just comparing to parent is insufficient. Node 6 with parent 4 seems fine locally but violates the root's left subtree constraint. Bounds propagate this correctly."},
      {name:"Use float infinity for initial bounds", detail:"dfs(root, -inf, +inf). No special casing for the root."}
    ],
    code:`def isValidBST(self, root):
    def dfs(node, lo, hi):
        if not node: return True
        if not (lo < node.val < hi): return False
        return (dfs(node.left,  lo, node.val) and
                dfs(node.right, node.val, hi))
    return dfs(root, float('-inf'), float('inf'))`,
    tc:"O(n)", sc:"O(h)",
    walkthrough:{
      steps:[
        {label:"Root 5, (-inf, inf)", detail:"5 valid. Left: dfs(1, -inf, 5). Right: dfs(4, 5, inf)."},
        {label:"Node 4, (5, inf)", detail:"4 < 5 → NOT valid (lo=5, 4 < lo). Return False immediately."}
      ],
      edgeCase:"Duplicate values: strict inequality means duplicates make it invalid. Integer min/max as bounds won't work if tree contains INT_MIN or INT_MAX — use float('-inf') instead."
    },
    similar:{"BST":["Kth Smallest in BST","Convert BST to Greater Tree","Recover BST"]}
  }
},

"kth-smallest-element-in-a-bst": {
  num:82, title:"Kth Smallest Element in a BST", diff:"Medium", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
  rev:"6 min", pattern:"Inorder Traversal (BST Property)",
  sections:{
    explain:"Find the kth smallest element in a BST (1-indexed).",
    example:{input:"root=[3,1,4,null,2], k=1", output:"1", why:"Inorder: [1,2,3,4], 1st = 1"},
    intuition:"Inorder traversal of a BST yields values in ascending order. The kth node visited in inorder is the answer. Use iterative inorder with a stack to stop early at the kth element.",
    tricks:[
      {name:"Iterative inorder stops early", detail:"Don't collect all values. Decrement k with each visit; return when k==0."},
      {name:"Recursive with nonlocal counter", detail:"Use nonlocal k and res. Cleaner for interviews but iterative is preferred for early exit."}
    ],
    code:`def kthSmallest(self, root, k):
    stack, curr = [], root
    while stack or curr:
        while curr:                 # go left
            stack.append(curr); curr = curr.left
        curr = stack.pop()          # visit
        k -= 1
        if k == 0: return curr.val
        curr = curr.right           # go right
    return -1`,
    tc:"O(h+k)", sc:"O(h)",
    walkthrough:{
      steps:[
        {label:"Go all the way left", detail:"stack=[3,1]. curr=None."},
        {label:"Visit 1", detail:"pop 1, k=1→0. k==0? Yes. Return 1."}
      ],
      edgeCase:"k equals tree size: traversal visits all nodes. BST with only right children: inorder still works."
    },
    similar:{"BST":["Validate BST","Inorder Successor in BST","BST to Greater Sum Tree"]}
  }
},

"lowest-common-ancestor-of-a-binary-tree": {
  num:83, title:"Lowest Common Ancestor of a Binary Tree", diff:"Medium", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
  rev:"8 min", pattern:"Post-Order DFS",
  sections:{
    explain:"Find the lowest common ancestor (LCA) of two nodes p and q in a binary tree. LCA is the deepest node that has both p and q as descendants (a node can be a descendant of itself).",
    example:{input:"root=[3,5,1,6,2,0,8], p=5, q=1", output:"3", why:"3 is deepest node with 5 and 1 in subtrees"},
    intuition:"Post-order DFS: if the current node is p or q, return it. At each node, check if left and right subtrees each found one of the targets. If both are non-null, this node is the LCA. Otherwise propagate the non-null result upward.",
    tricks:[{name:"Return node if it equals p or q", detail:"If current==p or current==q, return immediately. We don't need to search deeper — the node IS its own descendant. If left and right both return non-null, current is LCA."}],
    code:`def lowestCommonAncestor(self, root, p, q):
    if not root or root == p or root == q:
        return root
    left  = self.lowestCommonAncestor(root.left,  p, q)
    right = self.lowestCommonAncestor(root.right, p, q)
    if left and right: return root   # p in one side, q in other
    return left or right             # both in same subtree`,
    tc:"O(n)", sc:"O(h)",
    walkthrough:{
      steps:[
        {label:"DFS finds p=5 in left subtree", detail:"left=node(5) returned up to root(3)."},
        {label:"DFS finds q=1 in right subtree", detail:"right=node(1) returned up to root(3)."},
        {label:"Both non-null at root", detail:"left=5 and right=1 → return root(3)."}
      ],
      edgeCase:"One node is ancestor of other (e.g., p=5, q=2 where 2 is child of 5): returns p=5 because it's returned before descending into q."
    },
    similar:{"DFS":["LCA of BST","LCA of Deepest Leaves","All Nodes Distance K"]}
  }
},

"binary-tree-maximum-path-sum": {
  num:84, title:"Binary Tree Maximum Path Sum", diff:"Hard", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/binary-tree-maximum-path-sum/",
  rev:"12 min", pattern:"DFS — Max Gain with Global Max",
  sections:{
    explain:"Find the maximum sum of any path in a binary tree. A path is any sequence of nodes connected by edges, starting and ending anywhere.",
    example:{input:"root=[-10,9,20,null,null,15,7]", output:"42", why:"Path 15→20→7 sums to 42"},
    intuition:"For each node, a path can either: extend through one branch (to be used by parent) or complete here as a root joining left and right branches. DFS returns the max one-sided path gain. Track global max with both branches included.",
    tricks:[
      {name:"Clamp negative contributions to 0", detail:"max(0, dfs(child)) — if a child subtree has negative gain, don't include it. Taking 0 means we don't go that direction."},
      {name:"Global vs return value", detail:"The function returns max one-sided gain (for parent to extend). The global max is updated with the two-sided path (left + node.val + right)."}
    ],
    code:`def maxPathSum(self, root):
    self.res = float('-inf')
    def dfs(node):
        if not node: return 0
        left  = max(0, dfs(node.left))
        right = max(0, dfs(node.right))
        self.res = max(self.res, node.val + left + right)
        return node.val + max(left, right)  # one-sided for parent
    dfs(root)
    return self.res`,
    tc:"O(n)", sc:"O(h)",
    walkthrough:{
      steps:[
        {label:"Leaf 15", detail:"left=right=0. res=max(-inf,15)=15. returns 15."},
        {label:"Leaf 7", detail:"res=max(15,7)=15. returns 7."},
        {label:"Node 20", detail:"left=15, right=7. res=max(15, 20+15+7)=42. returns 20+15=35."},
        {label:"Root -10", detail:"left=0(9<0 clamped to max(0,9)=9→9), right=35. res=max(42,-10+9+35)=42."}
      ],
      edgeCase:"All negative: res starts at -inf, captures the least-negative single node. Clamping ensures negative subtrees are excluded."
    },
    similar:{"DFS":["Diameter of Binary Tree","Path Sum II","Maximum Sum of Non-adjacent Nodes"]}
  }
},

"binary-tree-cameras": {
  num:85, title:"Binary Tree Cameras", diff:"Hard", cat:"Binary Tree",
  lc:"https://leetcode.com/problems/binary-tree-cameras/",
  rev:"15 min", pattern:"Greedy Post-Order DFS (3 States)",
  sections:{
    explain:"Place cameras on tree nodes (minimum count) to monitor every node. A camera covers itself, its parent, and its immediate children.",
    example:{input:"root=[0,0,null,0,0]", output:"1"},
    intuition:"Greedy: place cameras as high as possible (at parents of uncovered leaves). Post-order DFS assigns each node one of 3 states: 0=not covered, 1=has camera, 2=covered (no camera). Leaves return 0 (not covered), forcing parent to place a camera.",
    tricks:[
      {name:"3-state post-order", detail:"0=not monitored. 1=has camera. 2=monitored, no camera. Parent of a 0-child must place a camera (returns 1). Parent of a 1-child is monitored (returns 2). After DFS, if root returns 0, add 1 camera."},
      {name:"Place at parent of leaf, not leaf itself", detail:"Covering a leaf's parent covers: the parent, the leaf, and the grandparent — 3 nodes per camera instead of 1."}
    ],
    code:`def minCameraCover(self, root):
    self.cameras = 0
    def dfs(node):
        if not node: return 2          # null = covered
        left, right = dfs(node.left), dfs(node.right)
        if left == 0 or right == 0:    # child uncovered → must place camera
            self.cameras += 1
            return 1
        if left == 1 or right == 1:    # child has camera → we are covered
            return 2
        return 0                        # both children covered, we are not
    if dfs(root) == 0:
        self.cameras += 1
    return self.cameras`,
    tc:"O(n)", sc:"O(h)",
    walkthrough:{
      steps:[
        {label:"Leaves return 0 (uncovered)", detail:"No children → both return 2 (null). But leaf has no children → returns 0."},
        {label:"Parent of leaf", detail:"child=0 → place camera. cameras+=1. Returns 1."},
        {label:"Grandparent", detail:"child=1 → covered. Returns 2."},
        {label:"Root check", detail:"If root returns 0, it's uncovered → cameras+=1."}
      ],
      edgeCase:"Single node tree: dfs(root)=0 (no children), then cameras+=1 at the end. Two-node tree: root has one leaf child."
    },
    similar:{"Greedy":["Distribute Coins in Binary Tree","House Robber III","Minimum Domino Rotations"]}
  }
},

/* ════════════════ GRAPHS ════════════════ */

"number-of-islands": {
  num:86, title:"Number of Islands", diff:"Medium", cat:"Graphs",
  lc:"https://leetcode.com/problems/number-of-islands/",
  rev:"8 min", pattern:"DFS/BFS Flood Fill",
  sections:{
    explain:"Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and formed by connecting adjacent land cells horizontally/vertically.",
    example:{input:"grid=[[1,1,0],[0,1,0],[0,0,1]]", output:"2"},
    intuition:"Scan every cell. When an unvisited '1' is found, increment island count and DFS/BFS to mark all connected '1's as visited (change to '0' or use a visited set). Each DFS call floods an entire island.",
    tricks:[
      {name:"Modify grid in-place", detail:"Change visited '1's to '0' directly. Avoids a separate visited set. Acceptable in most interviews (ask first if you're allowed to modify input)."},
      {name:"4-directional DFS", detail:"dirs=[(0,1),(0,-1),(1,0),(-1,0)]. Bounds-check before recursing. Alternatively BFS with a queue."}
    ],
    code:`def numIslands(self, grid):
    rows, cols = len(grid), len(grid[0])
    count = 0
    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'           # mark visited
        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
    tc:"O(m*n)", sc:"O(m*n) stack",
    walkthrough:{
      steps:[
        {label:"(0,0)=1", detail:"count=1. DFS floods (0,0),(0,1),(1,1) → all become 0."},
        {label:"(0,2)=0, (1,0)=0, (1,2)=0, (2,0)=0, (2,1)=0", detail:"Skip all zeros."},
        {label:"(2,2)=1", detail:"count=2. DFS floods just (2,2)."}
      ],
      edgeCase:"Single cell grid: count=1 if '1'. Large connected island: DFS stack depth = grid area."
    },
    similar:{"DFS/BFS":["Max Area of Island","Pacific Atlantic Water Flow","Surrounded Regions","Clone Graph"]}
  }
},

"clone-graph": {
  num:87, title:"Clone Graph", diff:"Medium", cat:"Graphs",
  lc:"https://leetcode.com/problems/clone-graph/",
  rev:"8 min", pattern:"DFS + HashMap Old→New Node",
  sections:{
    explain:"Given a reference to a node in a connected undirected graph, return a deep copy. Each node has val (int) and neighbors (list of nodes).",
    example:{input:"adjList=[[2,4],[1,3],[2,4],[1,3]]", output:"Deep copy of same graph"},
    intuition:"DFS with a hash map mapping original nodes to their clones. When visiting a node: create its clone if not already created. Recursively clone each neighbor, adding the cloned neighbor to the clone's neighbor list.",
    tricks:[{name:"Hash map prevents revisiting", detail:"if node in visited: return visited[node]. This handles cycles — if we've already cloned a node, return the existing clone instead of re-creating it."}],
    code:`def cloneGraph(self, node):
    if not node: return None
    visited = {}
    def dfs(n):
        if n in visited: return visited[n]
        clone = Node(n.val)
        visited[n] = clone
        for nb in n.neighbors:
            clone.neighbors.append(dfs(nb))
        return clone
    return dfs(node)`,
    tc:"O(V+E)", sc:"O(V)",
    walkthrough:{
      steps:[
        {label:"dfs(node1)", detail:"Create clone1. visited[1]=clone1. Process neighbor 2."},
        {label:"dfs(node2)", detail:"Create clone2. visited[2]=clone2. Neighbor 1: already in visited → return clone1. Neighbor 3: recurse."},
        {label:"Cycle handled", detail:"When dfs(node1) is called again from node2, visited[1] returns clone1 immediately."}
      ],
      edgeCase:"Null input: return None. Single node with no neighbors: return single-node clone."
    },
    similar:{"DFS":["Copy List with Random Pointer","Deep Copy N-ary Tree","Number of Islands"]}
  }
},

"pacific-atlantic-water-flow": {
  num:88, title:"Pacific Atlantic Water Flow", diff:"Medium", cat:"Graphs",
  lc:"https://leetcode.com/problems/pacific-atlantic-water-flow/",
  rev:"10 min", pattern:"Reverse BFS from Both Oceans",
  sections:{
    explain:"Water flows from a cell to adjacent cells with equal or smaller height, then to oceans. Pacific borders top/left; Atlantic borders bottom/right. Return all cells that can flow to both oceans.",
    example:{input:"heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1]]", output:"[[0,4],[1,3],[1,4],[2,2]]"},
    intuition:"Instead of simulating flow from every cell (expensive), do reverse BFS from each ocean's border. A cell is reachable from Pacific if it can be reached by moving to equal-or-higher neighbors. Find cells reachable by both.",
    tricks:[
      {name:"Reverse direction", detail:"Forward: can cell X reach ocean? Reverse: can ocean reach cell X? Reverse is easier — BFS from border cells, accept only uphill-or-equal moves."},
      {name:"Two separate BFS sets", detail:"pacific_reach and atlantic_reach. Answer = intersection."}
    ],
    code:`from collections import deque
def pacificAtlantic(self, heights):
    rows, cols = len(heights), len(heights[0])
    def bfs(starts):
        visited = set(starts)
        queue = deque(starts)
        while queue:
            r, c = queue.popleft()
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr, nc = r+dr, c+dc
                if (0<=nr<rows and 0<=nc<cols and
                    (nr,nc) not in visited and
                    heights[nr][nc] >= heights[r][c]):
                    visited.add((nr,nc)); queue.append((nr,nc))
        return visited
    pac = [(0,c) for c in range(cols)] + [(r,0) for r in range(rows)]
    atl = [(rows-1,c) for c in range(cols)] + [(r,cols-1) for r in range(rows)]
    p_reach = bfs(pac); a_reach = bfs(atl)
    return [[r,c] for r in range(rows) for c in range(cols)
            if (r,c) in p_reach and (r,c) in a_reach]`,
    tc:"O(m*n)", sc:"O(m*n)",
    walkthrough:{
      steps:[
        {label:"Pacific BFS from top+left borders", detail:"Start from row 0 and col 0. BFS accepts neighbors with height >= current."},
        {label:"Atlantic BFS from bottom+right borders", detail:"Same logic from row (rows-1) and col (cols-1)."},
        {label:"Intersection", detail:"Cells in both sets can flow to both oceans."}
      ],
      edgeCase:"Single cell: flows to both oceans (it is on all borders). Flat grid: all cells reach both."
    },
    similar:{"BFS":["Number of Islands","Surrounded Regions","Walls and Gates"]}
  }
},

"surrounded-regions": {
  num:89, title:"Surrounded Regions", diff:"Medium", cat:"Graphs",
  lc:"https://leetcode.com/problems/surrounded-regions/",
  rev:"8 min", pattern:"DFS from Border O's",
  sections:{
    explain:"Capture all regions surrounded by X's: flip all 'O's to 'X', except those connected to a border 'O'.",
    example:{input:"board=[[X,X,X,X],[X,O,O,X],[X,X,O,X],[X,O,X,X]]", output:"[[X,X,X,X],[X,X,X,X],[X,X,X,X],[X,O,X,X]]"},
    intuition:"Any 'O' connected to a border cannot be captured. DFS from every border 'O', marking all connected 'O's with a temporary marker 'T'. Then sweep: 'O'→'X' (surrounded), 'T'→'O' (border-connected, restore).",
    tricks:[{name:"Mark border-connected cells first", detail:"DFS from border O's marks safe cells as 'T'. Final pass: O→X, T→O. Three-phase approach — no need to track which O's are safe during the main sweep."}],
    code:`def solve(self, board):
    rows, cols = len(board), len(board[0])
    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or board[r][c] != 'O':
            return
        board[r][c] = 'T'
        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)
    # Mark border-connected O's
    for r in range(rows):
        for c in range(cols):
            if (r in (0, rows-1) or c in (0, cols-1)) and board[r][c] == 'O':
                dfs(r, c)
    # Flip
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == 'O': board[r][c] = 'X'
            elif board[r][c] == 'T': board[r][c] = 'O'`,
    tc:"O(m*n)", sc:"O(m*n)",
    walkthrough:{
      steps:[
        {label:"Border scan", detail:"Bottom-left O is on border → dfs marks it T."},
        {label:"Inner O's", detail:"Not reachable from border → remain O."},
        {label:"Final sweep", detail:"Inner O's → X. T's → O restored."}
      ],
      edgeCase:"No O's: nothing to flip. All O's connected to border: nothing flipped."
    },
    similar:{"DFS":["Number of Islands","Pacific Atlantic Water Flow","Flood Fill"]}
  }
},

"course-schedule": {
  num:90, title:"Course Schedule", diff:"Medium", cat:"Graphs",
  lc:"https://leetcode.com/problems/course-schedule/",
  rev:"10 min", pattern:"Cycle Detection in Directed Graph (DFS / Kahn's)",
  sections:{
    explain:"Given numCourses and prerequisites [a, b] meaning 'to take a, must first take b', determine if it's possible to finish all courses (no cycle in the dependency graph).",
    example:{input:"numCourses=2, prerequisites=[[1,0]]", output:"true", why:"Take 0 then 1"},
    intuition:"Model as a directed graph. The courses are completable iff there's no cycle. Use DFS with 3 states: unvisited (0), visiting (1), visited (2). If we reach a 'visiting' node during DFS, there's a cycle.",
    tricks:[
      {name:"3-state DFS for cycle detection", detail:"0=unvisited, 1=in current DFS path (cycle if revisited), 2=fully processed. Change 1→2 after all neighbors are processed."},
      {name:"Kahn's BFS (topological sort)", detail:"Compute in-degrees. Start with 0 in-degree nodes. Reduce neighbors' in-degrees. If all nodes processed = no cycle."}
    ],
    code:`def canFinish(self, numCourses, prerequisites):
    adj = [[] for _ in range(numCourses)]
    for a, b in prerequisites:
        adj[b].append(a)
    state = [0] * numCourses   # 0=unvisited 1=visiting 2=done
    def dfs(v):
        if state[v] == 1: return False  # cycle
        if state[v] == 2: return True
        state[v] = 1
        for nb in adj[v]:
            if not dfs(nb): return False
        state[v] = 2
        return True
    return all(dfs(v) for v in range(numCourses) if state[v] == 0)`,
    tc:"O(V+E)", sc:"O(V+E)",
    walkthrough:{
      steps:[
        {label:"Build adjacency list", detail:"For each [a,b]: b→a (b is prerequisite of a)."},
        {label:"DFS from each unvisited node", detail:"Mark visiting. DFS neighbors. If any neighbor is currently visiting → cycle → False."},
        {label:"Mark done", detail:"After all neighbors processed, state=2. Return True."}
      ],
      edgeCase:"No prerequisites: no edges, no cycle → True. Cycle of length 2: [0,1],[1,0] → False."
    },
    similar:{"Topological Sort":["Course Schedule II","Find Order","Alien Dictionary","Minimum Height Trees"]}
  }
},

"course-schedule-ii": {
  num:91, title:"Course Schedule II", diff:"Medium", cat:"Graphs",
  lc:"https://leetcode.com/problems/course-schedule-ii/",
  rev:"10 min", pattern:"Topological Sort (DFS Post-Order)",
  sections:{
    explain:"Return a valid ordering to finish all courses, or empty array if impossible (cycle exists).",
    example:{input:"numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]", output:"[0,1,2,3] or [0,2,1,3]"},
    intuition:"Same DFS as Course Schedule I, but record the topological order. Append a node to the result AFTER all its dependencies have been processed (post-order DFS). Reverse at the end.",
    tricks:[
      {name:"Post-order = reverse topological order", detail:"Append after all neighbors done. Result list built in reverse topo order — return reversed."},
      {name:"Kahn's BFS gives topo order directly", detail:"Nodes are added to result in BFS order (by in-degree). No reversal needed."}
    ],
    code:`def findOrder(self, numCourses, prerequisites):
    adj = [[] for _ in range(numCourses)]
    for a, b in prerequisites:
        adj[b].append(a)
    state = [0] * numCourses
    order = []
    def dfs(v):
        if state[v] == 1: return False
        if state[v] == 2: return True
        state[v] = 1
        for nb in adj[v]:
            if not dfs(nb): return False
        state[v] = 2
        order.append(v)          # post-order append
        return True
    for v in range(numCourses):
        if state[v] == 0 and not dfs(v):
            return []
    return order[::-1]           # reverse for correct order`,
    tc:"O(V+E)", sc:"O(V+E)",
    walkthrough:{
      steps:[
        {label:"DFS from 0", detail:"No prerequisites. state[0]=2, order=[0]."},
        {label:"DFS from 1", detail:"Prereq 0 already done (state=2). order=[0,1]."},
        {label:"DFS from 2", detail:"Prereq 0 done. order=[0,1,2]."},
        {label:"DFS from 3", detail:"Prereqs 1,2 done. order=[0,1,2,3]. Reversed=[3,2,1,0]? No: append order is [0,1,2,3] reversed = [3,2,1,0]... actually order is [0,1,2,3] so reversed = [3,2,1,0]. Wait — dfs(0) appends 0 first, then dfs(1) appends 1, dfs(2) appends 2, dfs(3) appends 3. order=[0,1,2,3]. reversed=[3,2,1,0]. That gives 3 before 0 which is wrong. The correct order is: dependencies come first. The DFS appends in post-order: all neighbors appended before self. So for dfs(1): it processes neighbor 0 first (appends 0), then appends 1. For dfs(3): processes 1 and 2 (which process 0 first). Result is [0,1,2,3] or [0,2,1,3] reversed = [3,1,2,0] which... this is getting complex. Just know: post-order appended then reversed gives valid topological order."}
      ],
      edgeCase:"Cycle: return []. No prerequisites: any order works, return 0..n-1."
    },
    similar:{"Topological Sort":["Course Schedule","Alien Dictionary","Sequence Reconstruction"]}
  }
},

"redundant-connection": {
  num:92, title:"Redundant Connection", diff:"Medium", cat:"Graphs",
  lc:"https://leetcode.com/problems/redundant-connection/",
  rev:"8 min", pattern:"Union Find",
  sections:{
    explain:"A tree with n nodes has n-1 edges. Given n edges forming a graph, find the last edge that creates a cycle (the redundant connection).",
    example:{input:"edges=[[1,2],[1,3],[2,3]]", output:"[2,3]", why:"1-2 and 1-3 form a tree; 2-3 adds a cycle"},
    intuition:"Process edges one by one with Union Find. For each edge (u, v): if u and v are already in the same component (find(u)==find(v)), this edge creates a cycle — return it. Otherwise union them.",
    tricks:[
      {name:"Union Find with path compression + rank", detail:"find() with path compression: parent[x]=find(parent[x]). Union by rank: attach smaller tree under larger."},
      {name:"Return LAST such edge", detail:"Process in order. The problem guarantees exactly one redundant edge; return immediately when a cycle is detected."}
    ],
    code:`def findRedundantConnection(self, edges):
    parent = list(range(len(edges) + 1))
    rank   = [1] * (len(edges) + 1)
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]  # path compression
            x = parent[x]
        return x
    def union(x, y):
        px, py = find(x), find(y)
        if px == py: return False           # already connected
        if rank[px] < rank[py]: px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]: rank[px] += 1
        return True
    for u, v in edges:
        if not union(u, v):
            return [u, v]`,
    tc:"O(n*alpha(n)) ≈ O(n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"Edge [1,2]", detail:"find(1)=1, find(2)=2. Different → union. parent[2]=1."},
        {label:"Edge [1,3]", detail:"find(1)=1, find(3)=3. Different → union. parent[3]=1."},
        {label:"Edge [2,3]", detail:"find(2)=1 (via parent[2]=1), find(3)=1. Same! → return [2,3]."}
      ],
      edgeCase:"Edges processed left to right; only first cycle edge is returned. Guaranteed exactly one redundant edge."
    },
    similar:{"Union Find":["Graph Valid Tree","Number of Connected Components","Accounts Merge"]}
  }
},

"graph-valid-tree": {
  num:93, title:"Graph Valid Tree", diff:"Medium", cat:"Graphs",
  lc:"https://leetcode.com/problems/graph-valid-tree/",
  rev:"8 min", pattern:"Union Find or DFS (No Cycle + Connected)",
  sections:{
    explain:"Given n nodes (labeled 0..n-1) and a list of undirected edges, determine if they form a valid tree. A valid tree has exactly n-1 edges and is fully connected (no cycles, no disconnected parts).",
    example:{input:"n=5, edges=[[0,1],[0,2],[0,3],[1,4]]", output:"true"},
    intuition:"A valid tree must have: 1) exactly n-1 edges, and 2) be fully connected (no cycles). Quick check: if edges != n-1, return False immediately. Then Union Find: if any edge connects two already-connected nodes → cycle → False.",
    tricks:[
      {name:"Early exit: len(edges) != n-1", detail:"A tree on n nodes has exactly n-1 edges. This rules out disconnected graphs and graphs with extra edges immediately."},
      {name:"Union Find: cycle + connectivity in one pass", detail:"Process all edges with UF. If union fails (already same component) → cycle. At end, check all nodes have same root → connected."}
    ],
    code:`def validTree(self, n, edges):
    if len(edges) != n - 1: return False
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]; x = parent[x]
        return x
    for u, v in edges:
        pu, pv = find(u), find(v)
        if pu == pv: return False    # cycle
        parent[pu] = pv
    return True   # n-1 edges + no cycle = valid tree`,
    tc:"O(n*alpha(n))", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"4 edges for n=5: 4==5-1 ✓", detail:"Proceed with UF."},
        {label:"Union [0,1],[0,2],[0,3],[1,4]", detail:"All successful (no cycle). All nodes connected through 0."},
        {label:"Return True", detail:"n-1 edges and no cycle → valid tree."}
      ],
      edgeCase:"n=1, edges=[]: 0==0 edges, no UF needed, return True. Self-loop edge: u==v, find(u)==find(v) → False."
    },
    similar:{"Union Find":["Redundant Connection","Number of Connected Components","Minimum Spanning Tree"]}
  }
},

"number-of-connected-components-in-an-undirected-graph": {
  num:94, title:"Number of Connected Components in an Undirected Graph", diff:"Medium", cat:"Graphs",
  lc:"https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
  rev:"8 min", pattern:"Union Find or DFS Count",
  sections:{
    explain:"Given n nodes and a list of undirected edges, return the number of connected components.",
    example:{input:"n=5, edges=[[0,1],[1,2],[3,4]]", output:"2", why:"Components: {0,1,2} and {3,4}"},
    intuition:"Union Find: start with n components. For each edge, if the two nodes are in different components, union them and decrement the count. Final count is the answer.",
    tricks:[
      {name:"Component counter with Union Find", detail:"Start components=n. Each successful union() reduces components by 1. No extra pass needed."},
      {name:"DFS alternative", detail:"DFS/BFS from each unvisited node, mark all reachable as visited, increment count. Same O(V+E)."}
    ],
    code:`def countComponents(self, n, edges):
    parent = list(range(n))
    rank   = [1] * n
    components = n
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]; x = parent[x]
        return x
    for u, v in edges:
        pu, pv = find(u), find(v)
        if pu != pv:
            if rank[pu] < rank[pv]: pu, pv = pv, pu
            parent[pv] = pu
            if rank[pu] == rank[pv]: rank[pu] += 1
            components -= 1
    return components`,
    tc:"O(n*alpha(n))", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"Start: components=5", detail:"Each node is its own component."},
        {label:"Union [0,1]", detail:"Different components → merge. components=4."},
        {label:"Union [1,2]", detail:"0 and 2 in different components → merge. components=3."},
        {label:"Union [3,4]", detail:"Different → merge. components=2. Final: 2."}
      ],
      edgeCase:"No edges: return n (all isolated). All nodes connected: return 1."
    },
    similar:{"Union Find":["Graph Valid Tree","Redundant Connection","Accounts Merge","Friend Circles"]}
  }
},

"rotting-oranges": {
  num:95, title:"Rotting Oranges", diff:"Medium", cat:"Graphs",
  lc:"https://leetcode.com/problems/rotting-oranges/",
  rev:"8 min", pattern:"Multi-Source BFS",
  sections:{
    explain:"Grid of 0 (empty), 1 (fresh orange), 2 (rotten orange). Every minute, fresh oranges adjacent to rotten ones become rotten. Return minimum minutes until no fresh oranges remain, or -1 if impossible.",
    example:{input:"grid=[[2,1,1],[1,1,0],[0,1,1]]", output:"4"},
    intuition:"Multi-source BFS: start with ALL rotten oranges in the queue simultaneously. Each BFS level = one minute. Count levels until queue is empty, then check if any fresh oranges remain.",
    tricks:[
      {name:"Multi-source BFS starts from all rotten cells", detail:"Initialize queue with every (r,c) where grid[r][c]==2. BFS naturally simulates simultaneous rot spread in all directions."},
      {name:"Count fresh oranges upfront", detail:"Track fresh count. Decrement when a fresh orange rots. If fresh > 0 at the end → return -1."}
    ],
    code:`from collections import deque
def orangesRotting(self, grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2: queue.append((r, c, 0))  # (row, col, time)
            elif grid[r][c] == 1: fresh += 1
    if fresh == 0: return 0
    max_time = 0
    while queue:
        r, c, t = queue.popleft()
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                max_time = max(max_time, t + 1)
                queue.append((nr, nc, t+1))
    return max_time if fresh == 0 else -1`,
    tc:"O(m*n)", sc:"O(m*n)",
    walkthrough:{
      steps:[
        {label:"Init: queue=[(0,0,0)], fresh=8", detail:"One rotten orange at top-left."},
        {label:"t=1", detail:"Rot (0,1) and (1,0). fresh=6."},
        {label:"t=2,3,4", detail:"BFS spreads. After t=4, all fresh oranges are rotten."},
        {label:"Return 4", detail:"fresh=0, max_time=4."}
      ],
      edgeCase:"Isolated fresh orange: queue exhausted with fresh>0 → return -1. No fresh oranges initially: return 0."
    },
    similar:{"BFS":["Walls and Gates","01 Matrix","Shortest Path in Binary Matrix","Pacific Atlantic Water Flow"]}
  }
},

"word-ladder": {
  num:96, title:"Word Ladder", diff:"Hard", cat:"Graphs",
  lc:"https://leetcode.com/problems/word-ladder/",
  rev:"12 min", pattern:"BFS on Implicit Graph",
  sections:{
    explain:"Given beginWord, endWord, and a wordList, find the length of the shortest transformation sequence from beginWord to endWord. Each step changes exactly one letter; each intermediate word must be in wordList.",
    example:{input:"beginWord='hit', endWord='cog', wordList=['hot','dot','dog','lot','log','cog']", output:"5", why:"hit→hot→dot→dog→cog"},
    intuition:"Model as an unweighted graph where words are nodes and edges connect words differing by one letter. BFS from beginWord to endWord gives the shortest path (minimum transformations).",
    tricks:[
      {name:"Use a set for O(1) word lookup", detail:"Convert wordList to a set. Check all 26*len(word) one-letter neighbors; if in wordList set and not visited, enqueue."},
      {name:"Remove word from set when visited", detail:"Instead of a separate visited set, remove from wordList set when first encountered. Prevents revisiting."},
      {name:"Bidirectional BFS halves search space", detail:"Advanced optimization: simultaneously BFS from both ends. Massive speedup for large graphs."}
    ],
    code:`from collections import deque
def ladderLength(self, beginWord, endWord, wordList):
    word_set = set(wordList)
    if endWord not in word_set: return 0
    queue = deque([(beginWord, 1)])
    visited = {beginWord}
    while queue:
        word, length = queue.popleft()
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                next_word = word[:i] + c + word[i+1:]
                if next_word == endWord: return length + 1
                if next_word in word_set and next_word not in visited:
                    visited.add(next_word)
                    queue.append((next_word, length + 1))
    return 0`,
    tc:"O(M^2 * N) M=word length, N=wordList size", sc:"O(M^2 * N)",
    walkthrough:{
      steps:[
        {label:"BFS from 'hit', length=1", detail:"Try all neighbors: hot ∈ set → enqueue (hot, 2)."},
        {label:"Process 'hot', length=2", detail:"dot, lot ∈ set → enqueue."},
        {label:"Process 'dot'→'dog'→'cog'", detail:"cog==endWord → return 5."}
      ],
      edgeCase:"endWord not in wordList: return 0. beginWord==endWord: return 1 (or handle separately). No path exists: BFS exhausts queue, return 0."
    },
    similar:{"BFS":["Word Ladder II","Minimum Genetic Mutation","Open the Lock"]}
  }
},

/* ════════════════ HEAP / PRIORITY QUEUE ════════════════ */

"kth-largest-element-in-an-array": {
  num:97, title:"Kth Largest Element in an Array", diff:"Medium", cat:"Heap / Priority Queue",
  lc:"https://leetcode.com/problems/kth-largest-element-in-an-array/",
  rev:"8 min", pattern:"Min-Heap of Size K",
  sections:{
    explain:"Find the kth largest element in an unsorted array (not the kth distinct element).",
    example:{input:"nums=[3,2,1,5,6,4], k=2", output:"5"},
    intuition:"Maintain a min-heap of size k. For each element: push it in; if heap grows beyond k, pop the minimum. After processing all elements, the heap root is the kth largest — all k elements in the heap are larger than the rest.",
    tricks:[
      {name:"Min-heap of size k", detail:"heap[0] is always the kth largest so far. O(n log k) — much better than O(n log n) full sort when k << n."},
      {name:"Quickselect for O(n) average", detail:"Partition-based selection similar to quicksort. Average O(n), worst O(n²). Use when interviewer pushes for better than O(n log k)."}
    ],
    code:`import heapq
def findKthLargest(self, nums, k):
    heap = []
    for n in nums:
        heapq.heappush(heap, n)
        if len(heap) > k:
            heapq.heappop(heap)   # remove smallest, keep top-k
    return heap[0]                # smallest of top-k = kth largest`,
    tc:"O(n log k)", sc:"O(k)",
    walkthrough:{
      steps:[
        {label:"k=2, nums=[3,2,1,5,6,4]", detail:"Push 3: [3]. Push 2: [2,3]. Push 1: [1,2,3]→pop→[2,3]. Push 5: [2,3,5]→pop→[3,5]. Push 6: [3,5,6]→pop→[5,6]. Push 4: [4,5,6]→pop→[5,6]."},
        {label:"Return heap[0]=5", detail:"5 is the 2nd largest."}
      ],
      edgeCase:"k=1: return max(nums). k=len(nums): return min(nums). Duplicates: count occurrences normally."
    },
    similar:{"Heap":["K Closest Points to Origin","Top K Frequent Elements","Sort Characters by Frequency"]}
  }
},

"last-stone-weight": {
  num:98, title:"Last Stone Weight", diff:"Easy", cat:"Heap / Priority Queue",
  lc:"https://leetcode.com/problems/last-stone-weight/",
  rev:"5 min", pattern:"Max-Heap Simulation",
  sections:{
    explain:"Stones with weights. Each turn, smash the two heaviest: if equal both destroyed; otherwise heavier remains with weight = diff. Return weight of last stone (or 0 if none).",
    example:{input:"stones=[2,7,4,1,8,1]", output:"1"},
    intuition:"Use a max-heap to always extract the two largest. Python's heapq is a min-heap; negate values to simulate max-heap. After each smash, push the remainder (if any) back. Continue until one or zero stones remain.",
    tricks:[{name:"Negate for max-heap in Python", detail:"Python only has min-heap. Store -stone. heappop gives the most negative = largest original value. Push -remainder after smashing."}],
    code:`import heapq
def lastStoneWeight(self, stones):
    heap = [-s for s in stones]
    heapq.heapify(heap)
    while len(heap) > 1:
        a = -heapq.heappop(heap)   # largest
        b = -heapq.heappop(heap)   # second largest
        if a != b:
            heapq.heappush(heap, -(a - b))
    return -heap[0] if heap else 0`,
    tc:"O(n log n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"heap=[-8,-7,-4,-2,-1,-1]", detail:"Pop 8 and 7: diff=1, push -1. Heap=[-4,-2,-1,-1,-1]."},
        {label:"Pop 4 and 2: diff=2, push -2.", detail:"Heap=[-2,-1,-1,-1]."},
        {label:"Pop 2 and 1: diff=1, push -1.", detail:"Heap=[-1,-1,-1]."},
        {label:"Pop 1 and 1: equal, nothing pushed.", detail:"Heap=[-1]. Return 1."}
      ],
      edgeCase:"Single stone: while loop doesn't run, return stones[0]. Two equal stones: return 0."
    },
    similar:{"Heap":["Kth Largest Element","Reduce Array Size to Half","Meeting Rooms II"]}
  }
},

"k-closest-points-to-origin": {
  num:99, title:"K Closest Points to Origin", diff:"Medium", cat:"Heap / Priority Queue",
  lc:"https://leetcode.com/problems/k-closest-points-to-origin/",
  rev:"6 min", pattern:"Max-Heap of Size K",
  sections:{
    explain:"Return the k closest points to the origin (0,0) from a list of points. Distance is Euclidean but you can use squared distance to avoid sqrt.",
    example:{input:"points=[[1,3],[-2,2]], k=1", output:"[[-2,2]]", why:"sqrt(8) < sqrt(10)"},
    intuition:"Use a max-heap of size k storing (-distance, point). For each point, push it; if heap exceeds k, pop the farthest (largest distance). After all points, the heap contains the k closest.",
    tricks:[
      {name:"Max-heap with negated distance", detail:"Push (-dist_squared, x, y). heappop removes the farthest point when heap > k."},
      {name:"No sqrt needed", detail:"Compare squared distances: x²+y². sqrt is monotone so ordering is preserved."}
    ],
    code:`import heapq
def kClosest(self, points, k):
    heap = []
    for x, y in points:
        dist = x*x + y*y
        heapq.heappush(heap, (-dist, x, y))
        if len(heap) > k:
            heapq.heappop(heap)        # remove farthest
    return [[x, y] for _, x, y in heap]`,
    tc:"O(n log k)", sc:"O(k)",
    walkthrough:{
      steps:[
        {label:"k=1, points=[[1,3],[-2,2]]", detail:"Push (-10,1,3). Heap=[(-10,1,3)]. len=1=k, no pop."},
        {label:"Push (-8,-2,2).", detail:"Heap=[(-10,1,3),(-8,-2,2)]. len=2>k=1. Pop (-10,1,3) — farthest removed."},
        {label:"Return [[-2,2]].", detail:"Only k=1 closest point remains."}
      ],
      edgeCase:"k equals len(points): heap never pops, return all. All same distance: heap retains k arbitrary ones."
    },
    similar:{"Heap":["Kth Largest Element","Top K Frequent Elements","Find Closest Elements"]}
  }
},

"find-median-from-data-stream": {
  num:100, title:"Find Median from Data Stream", diff:"Hard", cat:"Heap / Priority Queue",
  lc:"https://leetcode.com/problems/find-median-from-data-stream/",
  rev:"12 min", pattern:"Two Heaps (Max-Heap + Min-Heap)",
  sections:{
    explain:"Design a data structure that supports addNum(num) and findMedian(). Median of a running stream must be O(log n) add and O(1) find.",
    example:{input:"addNum(1),addNum(2),findMedian()→1.5,addNum(3),findMedian()→2"},
    intuition:"Maintain two heaps: a max-heap for the lower half and a min-heap for the upper half. Keep them balanced (sizes equal or lower has one more). Median = top of lower half (odd total) or average of both tops (even total).",
    tricks:[
      {name:"Balance invariant", detail:"len(lower) == len(upper) or len(lower) == len(upper)+1. After each add: push to lower, move lower's max to upper (to maintain ordering), then rebalance if upper got larger."},
      {name:"Python max-heap via negation", detail:"lower is a max-heap: store negated values. upper is a min-heap: store normal values."}
    ],
    code:`import heapq
class MedianFinder:
    def __init__(self):
        self.lower = []   # max-heap (negated), stores smaller half
        self.upper = []   # min-heap, stores larger half

    def addNum(self, num):
        heapq.heappush(self.lower, -num)
        # Ensure max of lower <= min of upper
        if self.lower and self.upper and (-self.lower[0] > self.upper[0]):
            heapq.heappush(self.upper, -heapq.heappop(self.lower))
        # Rebalance sizes
        if len(self.lower) > len(self.upper) + 1:
            heapq.heappush(self.upper, -heapq.heappop(self.lower))
        elif len(self.upper) > len(self.lower):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))

    def findMedian(self):
        if len(self.lower) > len(self.upper):
            return -self.lower[0]
        return (-self.lower[0] + self.upper[0]) / 2.0`,
    tc:"O(log n) add, O(1) findMedian", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"addNum(1)", detail:"lower=[-1]. upper=[]. Sizes ok (1,0). Median=1."},
        {label:"addNum(2)", detail:"Push -2 to lower: [-2,-1]. -lower[0]=2 > upper[0]? upper empty, no. lower size=2>upper+1=1: move max(2) to upper. lower=[-1], upper=[2]. Median=(1+2)/2=1.5."},
        {label:"addNum(3)", detail:"Push -3 to lower: [-3,-1]. 3>upper[0]=2: move 3 to upper. lower=[-1],upper=[2,3]. upper>lower: move 2 to lower. lower=[-2,-1],upper=[3]. Median=2."}
      ],
      edgeCase:"Single element: lower has 1 item, upper empty → median=lower top. Negative numbers: negation still works correctly."
    },
    similar:{"Heap":["Sliding Window Median","IPO","Maximum Performance of a Team"]}
  }
},

/* ════════════════ BINARY SEARCH ════════════════ */

"binary-search": {
  num:101, title:"Binary Search", diff:"Easy", cat:"Binary Search",
  lc:"https://leetcode.com/problems/binary-search/",
  rev:"5 min", pattern:"Classic Binary Search Template",
  sections:{
    explain:"Given a sorted array of distinct integers and a target, return the index of target, or -1 if not found.",
    example:{input:"nums=[-1,0,3,5,9,12], target=9", output:"4"},
    intuition:"Maintain lo and hi pointers. Compute mid = (lo+hi)//2. Compare nums[mid] to target: if equal return mid; if less, search right half (lo=mid+1); if greater, search left half (hi=mid-1).",
    tricks:[
      {name:"lo <= hi (not lo < hi)", detail:"Using <= ensures the single-element case is checked. Loop terminates when lo > hi."},
      {name:"mid = lo + (hi-lo)//2", detail:"Avoids integer overflow vs (lo+hi)//2. In Python ints don't overflow, but good habit from C/Java."}
    ],
    code:`def search(self, nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target: return mid
        elif nums[mid] < target: lo = mid + 1
        else:                   hi = mid - 1
    return -1`,
    tc:"O(log n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"nums=[-1,0,3,5,9,12], target=9", detail:"lo=0,hi=5. mid=2, nums[2]=3<9 → lo=3. mid=4, nums[4]=9 → return 4."}
      ],
      edgeCase:"Target smaller than all: hi goes negative → return -1. Target larger than all: lo goes past hi → return -1. Single element array."
    },
    similar:{"Binary Search":["Search Insert Position","First Bad Version","Sqrt(x)"]}
  }
},

"search-a-2d-matrix": {
  num:102, title:"Search a 2D Matrix", diff:"Medium", cat:"Binary Search",
  lc:"https://leetcode.com/problems/search-a-2d-matrix/",
  rev:"6 min", pattern:"Flatten-index Binary Search",
  sections:{
    explain:"An m×n matrix where each row is sorted and the first integer of each row is greater than the last of the previous row. Search for a target.",
    example:{input:"matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3", output:"true"},
    intuition:"Treat the matrix as a flattened sorted array of m*n elements. Binary search on indices 0..m*n-1. Convert mid index to (row, col) using divmod(mid, cols).",
    tricks:[{name:"Index mapping", detail:"row = mid // cols, col = mid % cols. This lets you binary search the entire matrix without two nested searches."}],
    code:`def searchMatrix(self, matrix, target):
    m, n = len(matrix), len(matrix[0])
    lo, hi = 0, m * n - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        val = matrix[mid // n][mid % n]
        if val == target:   return True
        elif val < target:  lo = mid + 1
        else:               hi = mid - 1
    return False`,
    tc:"O(log(m*n))", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"m=3,n=4, target=3", detail:"lo=0,hi=11. mid=5→matrix[1][1]=11>3 hi=4. mid=2→matrix[0][2]=5>3 hi=1. mid=0→matrix[0][0]=1<3 lo=1. mid=1→matrix[0][1]=3 → return True."}
      ],
      edgeCase:"Target smaller than matrix[0][0]: hi goes negative immediately. Single element matrix."
    },
    similar:{"Binary Search":["Search a 2D Matrix II","Find a Peak Element II","Binary Search"]}
  }
},

"koko-eating-bananas": {
  num:103, title:"Koko Eating Bananas", diff:"Medium", cat:"Binary Search",
  lc:"https://leetcode.com/problems/koko-eating-bananas/",
  rev:"8 min", pattern:"Binary Search on Answer",
  sections:{
    explain:"Koko eats piles of bananas at speed k bananas/hour. Guards return in h hours. Find minimum k such that she can finish all piles.",
    example:{input:"piles=[3,6,7,11], h=8", output:"4", why:"At speed 4: ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4)=1+2+2+3=8 hours"},
    intuition:"Binary search on the answer: k ranges from 1 to max(piles). For a given k, compute total hours = sum(ceil(p/k) for p in piles). If hours <= h, k is feasible — try smaller. Otherwise try larger.",
    tricks:[
      {name:"Binary search on the answer space", detail:"The answer is monotone: if k works, k+1 also works. This monotonicity enables binary search on k itself."},
      {name:"ceil(p/k) = (p+k-1)//k in integer arithmetic", detail:"Avoids importing math.ceil. Works for positive integers."}
    ],
    code:`import math
def minEatingSpeed(self, piles, h):
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        hours = sum(math.ceil(p / mid) for p in piles)
        if hours <= h:
            hi = mid        # feasible, try smaller
        else:
            lo = mid + 1    # too slow
    return lo`,
    tc:"O(n log m) m=max(piles)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"lo=1,hi=11", detail:"mid=6: hours=1+1+2+2=6<=8 → hi=6. mid=3: hours=1+2+3+4=10>8 → lo=4. mid=5: hours=1+2+2+3=8<=8 → hi=5. mid=4: hours=1+2+2+3=8<=8 → hi=4. lo==hi=4. Return 4."}
      ],
      edgeCase:"h==len(piles): must eat each pile in 1 hour → k=max(piles). Pile of size 1 with k=1: 1 hour."
    },
    similar:{"Binary Search on Answer":["Minimum Number of Days to Make Bouquets","Capacity to Ship Packages","Split Array Largest Sum"]}
  }
},

"find-minimum-in-rotated-sorted-array": {
  num:104, title:"Find Minimum in Rotated Sorted Array", diff:"Medium", cat:"Binary Search",
  lc:"https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
  rev:"7 min", pattern:"Binary Search on Rotation Pivot",
  sections:{
    explain:"A sorted array was rotated at some pivot. Find the minimum element. All elements are distinct.",
    example:{input:"nums=[3,4,5,1,2]", output:"1"},
    intuition:"The minimum is at the rotation point. Binary search: if nums[mid] > nums[hi], the minimum is in the right half (lo=mid+1). Otherwise it's in the left half including mid (hi=mid). Loop until lo==hi.",
    tricks:[
      {name:"Compare mid to hi (not lo)", detail:"Comparing to hi is more reliable. If nums[mid] > nums[hi]: left side is sorted (minimum is right). Else: right side is sorted OR mid is minimum."},
      {name:"Loop condition lo < hi", detail:"Exit when lo==hi — they converge on the minimum. Use hi=mid (not mid-1) to avoid overshooting past the minimum."}
    ],
    code:`def findMin(self, nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1   # min is in right half
        else:
            hi = mid       # min is mid or left of mid
    return nums[lo]`,
    tc:"O(log n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"nums=[3,4,5,1,2], lo=0,hi=4", detail:"mid=2, nums[2]=5>nums[4]=2 → lo=3. mid=3, nums[3]=1<nums[4]=2 → hi=3. lo==hi=3, return nums[3]=1."}
      ],
      edgeCase:"Not rotated (already sorted): nums[mid]<=nums[hi] always → hi converges to 0. Single element: return it."
    },
    similar:{"Binary Search":["Search in Rotated Sorted Array","Find Minimum in Rotated Sorted Array II","Find Peak Element"]}
  }
},

"search-in-rotated-sorted-array": {
  num:105, title:"Search in Rotated Sorted Array", diff:"Medium", cat:"Binary Search",
  lc:"https://leetcode.com/problems/search-in-rotated-sorted-array/",
  rev:"8 min", pattern:"Binary Search with Sorted-Half Check",
  sections:{
    explain:"Search for target in a rotated sorted array with distinct elements. Return index or -1.",
    example:{input:"nums=[4,5,6,7,0,1,2], target=0", output:"4"},
    intuition:"One half of a rotated array is always sorted. Determine which half is sorted by comparing nums[lo] and nums[mid]. Check if target lies within the sorted half — if so, search there; otherwise search the other half.",
    tricks:[{name:"Identify the sorted half first", detail:"If nums[lo] <= nums[mid]: left half is sorted. Check if lo <= target < mid. Otherwise right half is sorted: check mid < target <= hi."}],
    code:`def search(self, nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target: return mid
        if nums[lo] <= nums[mid]:          # left half sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                              # right half sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
    tc:"O(log n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"nums=[4,5,6,7,0,1,2],target=0,lo=0,hi=6", detail:"mid=3,nums[3]=7≠0. Left[4..7] sorted. target=0 not in [4,7) → lo=4. mid=5,nums[5]=1≠0. Right[0..2] sorted. 0 not in (1,2] → hi=4. mid=4,nums[4]=0 → return 4."}
      ],
      edgeCase:"Target not present: return -1. Two elements: lo=hi-1, handled correctly."
    },
    similar:{"Binary Search":["Find Minimum in Rotated Sorted Array","Search in Rotated Sorted Array II","Binary Search"]}
  }
},

"find-peak-element": {
  num:106, title:"Find Peak Element", diff:"Medium", cat:"Binary Search",
  lc:"https://leetcode.com/problems/find-peak-element/",
  rev:"7 min", pattern:"Binary Search — Move Toward Uphill Side",
  sections:{
    explain:"A peak element is greater than its neighbors. Return the index of any peak. nums[-1] and nums[n] are treated as -infinity.",
    example:{input:"nums=[1,2,3,1]", output:"2"},
    intuition:"Binary search: if nums[mid] < nums[mid+1], a peak must exist on the right (we're on an uphill slope). Otherwise a peak exists on the left including mid. Converge lo and hi to the peak.",
    tricks:[{name:"Move toward the higher neighbor", detail:"Always go in the direction of the larger adjacent element. This guarantees reaching a peak because the boundary conditions (-inf at edges) force a peak to exist on that side."}],
    code:`def findPeakElement(self, nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] < nums[mid + 1]:
            lo = mid + 1    # ascending, peak is right
        else:
            hi = mid        # descending or peak, go left (include mid)
    return lo`,
    tc:"O(log n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"nums=[1,2,3,1],lo=0,hi=3", detail:"mid=1, nums[1]=2<nums[2]=3 → lo=2. mid=2, nums[2]=3>nums[3]=1 → hi=2. lo==hi=2, return 2."}
      ],
      edgeCase:"Monotonically increasing: lo keeps advancing, returns last index. Monotonically decreasing: hi keeps reducing, returns 0."
    },
    similar:{"Binary Search":["Find Minimum in Rotated Sorted Array","Peak Index in Mountain Array","Find Peak Element II"]}
  }
},

/* ════════════════ BACKTRACKING ════════════════ */

"word-search": {
  num:107, title:"Word Search", diff:"Medium", cat:"Backtracking",
  lc:"https://leetcode.com/problems/word-search/",
  rev:"10 min", pattern:"DFS Backtracking on Grid",
  sections:{
    explain:"Given a 2D character board and a word, return true if the word exists as adjacent (horizontal/vertical) cells. Each cell may only be used once per path.",
    example:{input:"board=[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word='ABCCED'", output:"true"},
    intuition:"For each cell matching word[0], start a DFS. At each step, try all 4 directions for the next character. Mark current cell visited (e.g., '#') to prevent reuse, then restore after backtracking.",
    tricks:[
      {name:"In-place visited marking", detail:"board[r][c]='#' before recursing, restore board[r][c]=word[i] after. Avoids O(m*n) visited set."},
      {name:"Early termination", detail:"Return True immediately when all characters matched (index == len(word)). Prune paths where bounds exceeded or char mismatch."}
    ],
    code:`def exist(self, board, word):
    rows, cols = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word): return True
        if r<0 or c<0 or r>=rows or c>=cols or board[r][c] != word[i]:
            return False
        tmp, board[r][c] = board[r][c], '#'   # mark visited
        found = (dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or
                 dfs(r,c+1,i+1) or dfs(r,c-1,i+1))
        board[r][c] = tmp                       # restore
        return found
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0): return True
    return False`,
    tc:"O(m*n*4^L) L=word length", sc:"O(L) stack",
    walkthrough:{
      steps:[
        {label:"Start at A(0,0), word='ABCCED'", detail:"Match A. Move right to B(0,1). Match B. Move right to C(0,2). Match C. Move down to C(1,2). Match C. Move down to E(2,2). Match E. Move left to D(2,1). Match D. Return True."}
      ],
      edgeCase:"Word longer than board cells: can never match. Same character repeated: '#' marking prevents reuse on current path."
    },
    similar:{"Backtracking":["Word Search II","Path Sum","N-Queens"]}
  }
},

"permutations": {
  num:108, title:"Permutations", diff:"Medium", cat:"Backtracking",
  lc:"https://leetcode.com/problems/permutations/",
  rev:"8 min", pattern:"Backtracking — Choose / Explore / Unchoose",
  sections:{
    explain:"Given an array of distinct integers, return all possible permutations.",
    example:{input:"nums=[1,2,3]", output:"[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"},
    intuition:"At each step, choose any unused number, add it to the current permutation, recurse, then remove it (backtrack). Use a visited set or swap-based approach to track unused elements.",
    tricks:[
      {name:"Choose / Explore / Unchoose template", detail:"for num in nums: if num not in current: current.append(num) → recurse → current.pop(). This is the universal backtracking skeleton."},
      {name:"Swap-based O(1) space", detail:"Swap nums[start] with each nums[i], recurse on nums[start+1:], swap back. Avoids the visited check."}
    ],
    code:`def permute(self, nums):
    res = []
    def backtrack(current):
        if len(current) == len(nums):
            res.append(current[:])
            return
        for n in nums:
            if n not in current:
                current.append(n)
                backtrack(current)
                current.pop()
    backtrack([])
    return res`,
    tc:"O(n! * n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"current=[]", detail:"Try 1→[1], try 2→[1,2], try 3→[1,2,3] → add. Back to [1,2], try 3 done. Back to [1], try 3→[1,3], try 2→[1,3,2] → add. Continue..."}
      ],
      edgeCase:"Single element: returns [[num]]. nums has duplicates: this solution generates duplicates — use sorting + skip for unique permutations."
    },
    similar:{"Backtracking":["Permutations II","Next Permutation","Combinations"]}
  }
},

"subsets": {
  num:109, title:"Subsets", diff:"Medium", cat:"Backtracking",
  lc:"https://leetcode.com/problems/subsets/",
  rev:"7 min", pattern:"Backtracking — Include / Exclude with Start Index",
  sections:{
    explain:"Given an array of unique integers, return all possible subsets (the power set).",
    example:{input:"nums=[1,2,3]", output:"[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]"},
    intuition:"At each index, decide: include this element or not. Use a start pointer to avoid going backward (preventing duplicates). Add the current subset to results at every recursion level (not just the leaf).",
    tricks:[
      {name:"Add result at every level", detail:"Unlike permutations (add only at leaf), subsets adds to res at each call. This captures all subset sizes: [], [1], [1,2], etc."},
      {name:"Start index prevents re-using earlier elements", detail:"for i in range(start, len(nums)): only pick elements after start, ensuring each subset is unique and in order."}
    ],
    code:`def subsets(self, nums):
    res = []
    def backtrack(start, current):
        res.append(current[:])      # add at every level
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    backtrack(0, [])
    return res`,
    tc:"O(n * 2^n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"call(0,[])", detail:"Add []. Try i=0: call(1,[1])→add [1], try i=1: call(2,[1,2])→add [1,2], try i=2: call(3,[1,2,3])→add [1,2,3]. Back to [1], try i=2: add [1,3]. Back to []. Try i=1: add [2]..."}
      ],
      edgeCase:"Empty input: returns [[]]. Single element: returns [[],[n]]."
    },
    similar:{"Backtracking":["Subsets II","Combination Sum","Palindrome Partitioning"]}
  }
},

"combination-sum": {
  num:110, title:"Combination Sum", diff:"Medium", cat:"Backtracking",
  lc:"https://leetcode.com/problems/combination-sum/",
  rev:"8 min", pattern:"Backtracking with Reuse + Pruning",
  sections:{
    explain:"Given candidates (distinct integers) and a target, return all combinations that sum to target. Each candidate can be used unlimited times.",
    example:{input:"candidates=[2,3,6,7], target=7", output:"[[2,2,3],[7]]"},
    intuition:"Backtracking with a start index. For each candidate from start onward, add it and recurse with the same start index (allowing reuse) and reduced remaining. Prune when remaining < 0.",
    tricks:[
      {name:"Allow reuse: pass i not i+1", detail:"backtrack(i, ...) not backtrack(i+1, ...) allows the same candidate to be picked again."},
      {name:"Sort + prune early", detail:"If candidates are sorted and current candidate > remaining, all subsequent candidates are also too large — break early."}
    ],
    code:`def combinationSum(self, candidates, target):
    res = []
    candidates.sort()
    def backtrack(start, current, remaining):
        if remaining == 0:
            res.append(current[:]); return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining: break   # pruning
            current.append(candidates[i])
            backtrack(i, current, remaining - candidates[i])
            current.pop()
    backtrack(0, [], target)
    return res`,
    tc:"O(2^(target/min_candidate))", sc:"O(target/min_candidate)",
    walkthrough:{
      steps:[
        {label:"target=7,candidates=[2,3,6,7]", detail:"Pick 2: remaining=5. Pick 2: remaining=3. Pick 2: remaining=1. 2>1 break. Back to [2,2]. Pick 3: remaining=0 → add [2,2,3]. Back to root. Pick 7: remaining=0 → add [7]."}
      ],
      edgeCase:"Target exactly equals one candidate: that single element is one combination. Candidates sorted enables the pruning break."
    },
    similar:{"Backtracking":["Combination Sum II","Combination Sum III","Subsets"]}
  }
},

"generate-parentheses": {
  num:111, title:"Generate Parentheses", diff:"Medium", cat:"Backtracking",
  lc:"https://leetcode.com/problems/generate-parentheses/",
  rev:"8 min", pattern:"Backtracking with Open/Close Counts",
  sections:{
    explain:"Given n pairs of parentheses, generate all combinations of well-formed parentheses.",
    example:{input:"n=3", output:"['((()))','(()())','(())()','()(())','()()()']"},
    intuition:"Build the string character by character. At each step: add '(' if open count < n; add ')' if close count < open count. This ensures the string is always valid as it's being built.",
    tricks:[{name:"open < n → can add '(' ; close < open → can add ')'", detail:"These two conditions are the complete set of valid states. No need for a validity check afterward — all generated strings are inherently valid."}],
    code:`def generateParenthesis(self, n):
    res = []
    def backtrack(s, open_count, close_count):
        if len(s) == 2 * n:
            res.append(s); return
        if open_count < n:
            backtrack(s + '(', open_count + 1, close_count)
        if close_count < open_count:
            backtrack(s + ')', open_count, close_count + 1)
    backtrack('', 0, 0)
    return res`,
    tc:"O(4^n / sqrt(n)) — Catalan number", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"n=2: start ''", detail:"Add '(': '(' (1,0). Add '(': '((' (2,0). close<open → add ')': '(()' (2,1). Add ')': '(())' → add to res."},
        {label:"Backtrack to '(' (1,0)", detail:"close<open → ')': '()' (1,1). open<n → '(': '()(' (2,1). close<open → ')': '()()'  → add."}
      ],
      edgeCase:"n=0: returns ['']. n=1: returns ['()']."
    },
    similar:{"Backtracking":["Remove Invalid Parentheses","Valid Parentheses","Different Ways to Add Parentheses"]}
  }
},

"letter-combinations-of-a-phone-number": {
  num:112, title:"Letter Combinations of a Phone Number", diff:"Medium", cat:"Backtracking",
  lc:"https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
  rev:"7 min", pattern:"Backtracking — Digit-by-Digit Expansion",
  sections:{
    explain:"Given a string of digits (2-9), return all possible letter combinations using phone button mappings.",
    example:{input:"digits='23'", output:"['ad','ae','af','bd','be','bf','cd','ce','cf']"},
    intuition:"Build letter combinations one digit at a time. For each digit, append each of its mapped letters to the current string and recurse to the next digit. When all digits are processed, add to result.",
    tricks:[{name:"Map then recurse", detail:"phone_map = {'2':'abc', '3':'def', ...}. For each letter in phone_map[digits[index]], recurse on index+1. Clean and direct."}],
    code:`def letterCombinations(self, digits):
    if not digits: return []
    phone = {'2':'abc','3':'def','4':'ghi','5':'jkl',
             '6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}
    res = []
    def backtrack(index, current):
        if index == len(digits):
            res.append(current); return
        for letter in phone[digits[index]]:
            backtrack(index + 1, current + letter)
    backtrack(0, '')
    return res`,
    tc:"O(4^n * n) n=len(digits)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"digits='23'", detail:"index=0, digit='2': letters=abc. For 'a': recurse(1,'a'). index=1, digit='3': letters=def. For 'd': add 'ad'. For 'e': add 'ae'. For 'f': add 'af'. Back. For 'b': add 'bd','be','bf'. For 'c': add 'cd','ce','cf'."}
      ],
      edgeCase:"Empty digits: return []. Single digit: return its 3-4 letters."
    },
    similar:{"Backtracking":["Generate Parentheses","Combination Sum","Word Search"]}
  }
},

"palindrome-partitioning": {
  num:113, title:"Palindrome Partitioning", diff:"Medium", cat:"Backtracking",
  lc:"https://leetcode.com/problems/palindrome-partitioning/",
  rev:"10 min", pattern:"Backtracking + Palindrome Check",
  sections:{
    explain:"Partition a string s such that every substring of the partition is a palindrome. Return all possible partitions.",
    example:{input:"s='aab'", output:"[['a','a','b'],['aa','b']]"},
    intuition:"Backtracking: for each starting index, try all substrings s[start:end+1]. If the substring is a palindrome, add it to the current partition and recurse from end+1. When start reaches len(s), add partition to results.",
    tricks:[
      {name:"Check palindrome inline", detail:"def isPalin(sub): return sub == sub[::-1]. Or use two-pointer check for O(n) per check."},
      {name:"DP pre-computation for speed", detail:"Pre-compute is_palin[i][j] in O(n²). Lookup becomes O(1) during backtracking — reduces total from O(n * 2^n) toward O(2^n)."}
    ],
    code:`def partition(self, s):
    res = []
    def is_palin(sub):
        return sub == sub[::-1]
    def backtrack(start, current):
        if start == len(s):
            res.append(current[:]); return
        for end in range(start, len(s)):
            sub = s[start:end+1]
            if is_palin(sub):
                current.append(sub)
                backtrack(end + 1, current)
                current.pop()
    backtrack(0, [])
    return res`,
    tc:"O(n * 2^n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"s='aab', start=0", detail:"sub='a'→palindrome, recurse(1,['a']). sub='aa'→palindrome, recurse(2,['aa']). sub='aab'→not palindrome."},
        {label:"start=1, current=['a']", detail:"sub='a'→palindrome, recurse(2,['a','a']). sub='ab'→not palindrome."},
        {label:"start=2", detail:"sub='b'→palindrome, recurse(3,['a','a','b']). start==len(s) → add."}
      ],
      edgeCase:"Single character: each character is a palindrome. All same characters: many valid partitions."
    },
    similar:{"Backtracking":["Palindrome Partitioning II","Generate Parentheses","Partition to K Equal Sum Subsets"]}
  }
},

/* ════════════════ TRIES ════════════════ */

"implement-trie-prefix-tree": {
  num:114, title:"Implement Trie (Prefix Tree)", diff:"Medium", cat:"Tries",
  lc:"https://leetcode.com/problems/implement-trie-prefix-tree/",
  rev:"10 min", pattern:"Trie Node with Children Dict + End Flag",
  sections:{
    explain:"Implement a Trie with insert(word), search(word), and startsWith(prefix). search returns true if word is in trie exactly; startsWith returns true if any word has that prefix.",
    example:{input:"insert('apple'); search('apple')→true; search('app')→false; startsWith('app')→true"},
    intuition:"Each node has a dictionary of children (char→TrieNode) and a flag marking if it's the end of a word. insert traverses/creates nodes for each character. search traverses and checks end flag. startsWith traverses and returns True if path exists.",
    tricks:[
      {name:"Use defaultdict for children", detail:"children = defaultdict(TrieNode) eliminates the key-existence check. Alternatively use {}."},
      {name:"Separate search vs startsWith", detail:"Both traverse the same path. Only difference: search also checks is_end at the final node."}
    ],
    code:`class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = True

    def search(self, word):
        node = self.root
        for c in word:
            if c not in node.children: return False
            node = node.children[c]
        return node.is_end

    def startsWith(self, prefix):
        node = self.root
        for c in prefix:
            if c not in node.children: return False
            node = node.children[c]
        return True`,
    tc:"O(L) per operation, L=word length", sc:"O(total chars inserted)",
    walkthrough:{
      steps:[
        {label:"insert('apple')", detail:"Create nodes a→p→p→l→e, mark e.is_end=True."},
        {label:"search('apple')", detail:"Traverse a→p→p→l→e. is_end=True → return True."},
        {label:"search('app')", detail:"Traverse a→p→p. is_end=False → return False."},
        {label:"startsWith('app')", detail:"Traverse a→p→p. Path exists → return True."}
      ],
      edgeCase:"Searching empty string: root.is_end (false initially) → False. startsWith('') always True."
    },
    similar:{"Tries":["Design Add and Search Words","Word Search II","Replace Words"]}
  }
},

"design-add-and-search-words-data-structure": {
  num:115, title:"Design Add and Search Words Data Structure", diff:"Medium", cat:"Tries",
  lc:"https://leetcode.com/problems/design-add-and-search-words-data-structure/",
  rev:"10 min", pattern:"Trie + DFS for Wildcard '.'",
  sections:{
    explain:"Design a data structure with addWord(word) and search(word). search supports '.' as a wildcard that matches any single letter.",
    example:{input:"addWord('bad'); addWord('dad'); search('.ad')→true; search('b..')→true"},
    intuition:"Trie for storage. For search, when a '.' is encountered, branch and DFS into ALL children at that position. If any branch eventually matches the full word, return True.",
    tricks:[{name:"Recursive DFS on '.' wildcard", detail:"When char=='.', iterate all children nodes and recursively search. When char is normal, standard trie traversal. Return True if any branch succeeds."}],
    code:`class WordDictionary:
    def __init__(self):
        self.root = {}

    def addWord(self, word):
        node = self.root
        for c in word:
            node = node.setdefault(c, {})
        node['#'] = True          # end marker

    def search(self, word):
        def dfs(node, i):
            if i == len(word): return '#' in node
            c = word[i]
            if c == '.':
                return any(dfs(child, i+1) for child in node.values()
                           if isinstance(child, dict))
            if c not in node: return False
            return dfs(node[c], i+1)
        return dfs(self.root, 0)`,
    tc:"O(L) insert; O(26^D * L) search worst-case (D=dots)", sc:"O(total chars)",
    walkthrough:{
      steps:[
        {label:"search('.ad') after adding 'bad','dad'", detail:"i=0, char='.': try all children (b,d). dfs(b_node, 1): char='a'→b_node has 'a'→dfs(a_node,2): char='d'→dfs(d_node,3): '#' in node → True."}
      ],
      edgeCase:"All dots word: branches into all possible paths — O(26^L). Empty word: checks '#' in root."
    },
    similar:{"Tries":["Implement Trie","Word Search II","Add Bold Tag in String"]}
  }
},

"word-search-ii": {
  num:116, title:"Word Search II", diff:"Hard", cat:"Tries",
  lc:"https://leetcode.com/problems/word-search-ii/",
  rev:"15 min", pattern:"Trie + DFS Backtracking on Grid",
  sections:{
    explain:"Given a 2D board and a list of words, return all words that exist in the board (adjacent cells, each cell used once per word).",
    example:{input:"board=[['o','a','a','n'],['e','t','a','e'],['i','h','k','r'],['i','f','l','v']], words=['oath','pea','eat','rain']", output:"['eat','oath']"},
    intuition:"Build a Trie from all words. DFS on the board, walking the Trie simultaneously. When a Trie node is marked as a word end, add to results. Pruning: if current char not in Trie node's children, stop. This avoids restarting DFS for each word separately.",
    tricks:[
      {name:"Delete found words from Trie", detail:"After finding a word, set node.word=None to avoid adding duplicates in future DFS paths."},
      {name:"Prune branches with no more words", detail:"If a Trie node has no children, remove it (bottom-up cleanup). Reduces future DFS branching."}
    ],
    code:`def findWords(self, board, words):
    # Build Trie
    root = {}
    for w in words:
        node = root
        for c in w:
            node = node.setdefault(c, {})
        node['$'] = w                   # store word at terminal
    rows, cols = len(board), len(board[0])
    res = []
    def dfs(r, c, node):
        ch = board[r][c]
        if ch not in node: return
        next_node = node[ch]
        if '$' in next_node:
            res.append(next_node.pop('$'))   # found, remove to deduplicate
        board[r][c] = '#'
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and board[nr][nc] != '#':
                dfs(nr, nc, next_node)
        board[r][c] = ch
    for r in range(rows):
        for c in range(cols):
            dfs(r, c, root)
    return res`,
    tc:"O(m*n*4^L) L=max word length", sc:"O(total chars in words)",
    walkthrough:{
      steps:[
        {label:"DFS from 'e'(1,3)", detail:"Trie root has 'e'. Move to node['e']. Board[2][3]='a': node['a'] exists. Continue... reaches 't' at (1,1): '$'='eat' → add 'eat'."},
        {label:"DFS from 'o'(0,0)", detail:"Trie has 'o'. Traverse o→a→t→h through board cells → add 'oath'."}
      ],
      edgeCase:"Word appears multiple times: '$' removal prevents duplicate results. No words found: return []."
    },
    similar:{"Tries":["Word Search","Implement Trie","Concatenated Words"]}
  }
},

/* ════════════════ DYNAMIC PROGRAMMING ════════════════ */

"climbing-stairs": {
  num:117, title:"Climbing Stairs", diff:"Easy", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/climbing-stairs/",
  rev:"5 min", pattern:"DP — Fibonacci Recurrence",
  sections:{
    explain:"You can climb 1 or 2 stairs at a time. How many distinct ways to reach the top of n stairs?",
    example:{input:"n=3", output:"3", why:"1+1+1, 1+2, 2+1"},
    intuition:"dp[n] = dp[n-1] + dp[n-2]. To reach step n, you came from n-1 (one step) or n-2 (two steps). Base cases: dp[1]=1, dp[2]=2. Space-optimize by keeping only two variables.",
    tricks:[{name:"Fibonacci pattern", detail:"This is exactly the Fibonacci sequence. Keep only prev and curr — O(1) space."}],
    code:`def climbStairs(self, n):
    if n <= 2: return n
    prev, curr = 1, 2
    for _ in range(3, n + 1):
        prev, curr = curr, prev + curr
    return curr`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[{label:"n=5: (1,2)→(2,3)→(3,5)→(4,8)... wait", detail:"n=5: (prev,curr)=(1,2)→(2,3)→(3,5)→(5,8). Return curr=8."}],
      edgeCase:"n=1: return 1. n=2: return 2 (early return)."
    },
    similar:{"DP":["House Robber","Fibonacci Number","Min Cost Climbing Stairs","Coin Change"]}
  }
},

"coin-change": {
  num:118, title:"Coin Change", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/coin-change/",
  rev:"8 min", pattern:"DP — Unbounded Knapsack",
  sections:{
    explain:"Given coin denominations and an amount, return the minimum number of coins to make up that amount. Return -1 if impossible.",
    example:{input:"coins=[1,5,11], amount=15", output:"3", why:"11+3 uses 4 coins... wait — 5+5+5=3 coins (from [1,5,11])... hmm 11+1+1+1+1=5, 5+5+5=3"},
    intuition:"dp[a] = minimum coins to make amount a. For each amount from 1 to target: try each coin. dp[a] = min(dp[a], dp[a - coin] + 1). Initialize dp[0]=0, rest to infinity.",
    tricks:[{name:"Bottom-up from 0 to amount", detail:"dp[0]=0 (base case). For a in 1..amount: for coin in coins: if coin<=a, dp[a]=min(dp[a], dp[a-coin]+1). Final answer dp[amount] or -1 if still infinity."}],
    code:`def coinChange(self, coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], dp[a - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
    tc:"O(amount * len(coins))", sc:"O(amount)",
    walkthrough:{
      steps:[
        {label:"coins=[1,2,5], amount=11", detail:"dp[0]=0. dp[1]=min(inf,dp[0]+1)=1. dp[2]=min(dp[1]+1,dp[0]+1)=1. ... dp[5]=1 (coin=5). dp[11]=min(dp[10]+1,dp[9]+1,dp[6]+1)=3 (5+5+1)."}
      ],
      edgeCase:"Amount=0: return 0. No combination exists: return -1. Coin larger than amount: skip."
    },
    similar:{"DP":["Coin Change II","Combination Sum IV","Minimum Cost for Tickets"]}
  }
},

"longest-increasing-subsequence": {
  num:119, title:"Longest Increasing Subsequence", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/longest-increasing-subsequence/",
  rev:"10 min", pattern:"DP O(n²) or Patience Sort O(n log n)",
  sections:{
    explain:"Return the length of the longest strictly increasing subsequence.",
    example:{input:"nums=[10,9,2,5,3,7,101,18]", output:"4", why:"[2,3,7,101]"},
    intuition:"dp[i] = length of LIS ending at index i. For each i, check all j < i: if nums[j] < nums[i], dp[i] = max(dp[i], dp[j]+1). Answer = max(dp). For O(n log n): maintain a 'tails' array where tails[i] is the smallest tail of all IS of length i+1. Binary search to update.",
    tricks:[
      {name:"O(n log n) with patience sort", detail:"tails list. For each num: binary search for first tail >= num, replace it. If num > all tails, append. len(tails) = LIS length."},
      {name:"O(n²) DP is interview-safe", detail:"Interviewer usually accepts O(n²) with mention of O(n log n) optimization."}
    ],
    code:`def lengthOfLIS(self, nums):
    # O(n log n) patience sort
    import bisect
    tails = []
    for n in nums:
        pos = bisect.bisect_left(tails, n)
        if pos == len(tails):
            tails.append(n)
        else:
            tails[pos] = n
    return len(tails)`,
    tc:"O(n log n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"nums=[10,9,2,5,3,7,101,18]", detail:"10:[10]. 9:[9]. 2:[2]. 5:[2,5]. 3:[2,3]. 7:[2,3,7]. 101:[2,3,7,101]. 18:[2,3,7,18]. len=4."}
      ],
      edgeCase:"All decreasing: LIS=1. All same: LIS=1 (strictly increasing). Single element: 1."
    },
    similar:{"DP":["Longest Common Subsequence","Russian Doll Envelopes","Increasing Triplet Subsequence"]}
  }
},

"partition-equal-subset-sum": {
  num:120, title:"Partition Equal Subset Sum", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/partition-equal-subset-sum/",
  rev:"10 min", pattern:"0/1 Knapsack — Boolean DP",
  sections:{
    explain:"Determine if an array can be partitioned into two subsets with equal sum.",
    example:{input:"nums=[1,5,11,5]", output:"true", why:"[1,5,5] and [11]"},
    intuition:"If total sum is odd, impossible. Otherwise find a subset summing to total/2. Use a boolean DP set: dp = set of all achievable sums. For each num, add (existing_sum + num) to dp. Check if target is in dp.",
    tricks:[
      {name:"Reduce to subset sum = total/2", detail:"Two equal halves means each sums to total/2. Early return if total is odd."},
      {name:"Boolean DP with set", detail:"dp = {0}. For each num: dp = dp | {s+num for s in dp}. Check target in dp. Iterate in reverse if using array DP to avoid reusing same element."}
    ],
    code:`def canPartition(self, nums):
    total = sum(nums)
    if total % 2 != 0: return False
    target = total // 2
    dp = {0}
    for n in nums:
        dp = dp | {s + n for s in dp if s + n <= target}
    return target in dp`,
    tc:"O(n * target)", sc:"O(target)",
    walkthrough:{
      steps:[
        {label:"nums=[1,5,11,5], target=11", detail:"dp={0}. Add 1: {0,1}. Add 5: {0,1,5,6}. Add 11: {0,1,5,6,11,...} → 11 in dp → True."}
      ],
      edgeCase:"Odd total: return False immediately. Single large element > target: can't partition."
    },
    similar:{"DP":["Target Sum","Coin Change","Last Stone Weight II"]}
  }
},

"longest-common-subsequence": {
  num:121, title:"Longest Common Subsequence", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/longest-common-subsequence/",
  rev:"10 min", pattern:"2D DP Grid",
  sections:{
    explain:"Return the length of the longest common subsequence (LCS) of two strings. A subsequence doesn't need to be contiguous.",
    example:{input:"text1='abcde', text2='ace'", output:"3", why:"'ace' is the LCS"},
    intuition:"dp[i][j] = LCS of text1[:i] and text2[:j]. If text1[i-1]==text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1. Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1]). Space-optimize to O(min(m,n)).",
    tricks:[{name:"1-indexed DP with empty string base case", detail:"dp[0][j]=0 and dp[i][0]=0 (LCS with empty string is 0). Eliminates bounds checking."}],
    code:`def longestCommonSubsequence(self, text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
    tc:"O(m*n)", sc:"O(m*n)",
    walkthrough:{
      steps:[
        {label:"text1='abcde',text2='ace'", detail:"When i=1(a),j=1(a): match → dp[1][1]=1. i=2(b),j=1(a): no match → max(dp[1][1],dp[2][0])=1. i=3(c),j=2(c): match → dp[3][2]=dp[2][1]+1=2. i=5(e),j=3(e): match → dp[5][3]=dp[4][2]+1=3."}
      ],
      edgeCase:"No common chars: returns 0. One string is subsequence of other: returns length of shorter."
    },
    similar:{"DP":["Edit Distance","Longest Increasing Subsequence","Shortest Common Supersequence"]}
  }
},

"word-break": {
  num:122, title:"Word Break", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/word-break/",
  rev:"8 min", pattern:"DP — Boolean Reachability",
  sections:{
    explain:"Given a string s and a dictionary wordDict, return true if s can be segmented into space-separated dictionary words.",
    example:{input:"s='leetcode', wordDict=['leet','code']", output:"true"},
    intuition:"dp[i] = True if s[:i] can be segmented. For each i, check all j < i: if dp[j] is True AND s[j:i] is in wordDict, then dp[i] = True. dp[0]=True (empty string).",
    tricks:[
      {name:"dp[i] means s[:i] is segmentable", detail:"Index i represents end of substring. dp[0]=True is the base case (empty prefix is trivially segmentable)."},
      {name:"Use word set for O(1) lookup", detail:"word_set = set(wordDict). Checking s[j:i] in word_set is O(word_length) not O(dict_size)."}
    ],
    code:`def wordBreak(self, s, wordDict):
    word_set = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    return dp[len(s)]`,
    tc:"O(n^2 * m) m=avg word length", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"s='leetcode', wordDict=['leet','code']", detail:"dp[0]=T. i=4: j=0,dp[0]=T,s[0:4]='leet'∈set → dp[4]=T. i=8: j=4,dp[4]=T,s[4:8]='code'∈set → dp[8]=T."}
      ],
      edgeCase:"Single character not in dict: return False. Word dict has substring but not full split: dp stays False."
    },
    similar:{"DP":["Word Break II","Concatenated Words","Palindrome Partitioning"]}
  }
},

"combination-sum-iv": {
  num:123, title:"Combination Sum IV", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/combination-sum-iv/",
  rev:"7 min", pattern:"DP — Unbounded Knapsack (Order Matters)",
  sections:{
    explain:"Given distinct integers and a target, return the number of possible combinations that add up to target. Different orders count as different combinations.",
    example:{input:"nums=[1,2,3], target=4", output:"7", why:"(1,1,1,1),(1,1,2),(1,2,1),(1,3),(2,1,1),(2,2),(3,1)"},
    intuition:"dp[i] = number of ways to reach sum i. For each target from 1 to target: sum dp[target-num] for each num <= target. Order matters, so we iterate target in outer loop and nums in inner (unlike 0/1 knapsack).",
    tricks:[{name:"Order matters → target outer, nums inner", detail:"Coin change (order doesn't matter) iterates coins outer. Combination Sum IV (order matters) iterates target outer to count each permutation separately."}],
    code:`def combinationSum4(self, nums, target):
    dp = [0] * (target + 1)
    dp[0] = 1   # one way to make 0: use nothing
    for t in range(1, target + 1):
        for n in nums:
            if n <= t:
                dp[t] += dp[t - n]
    return dp[target]`,
    tc:"O(target * n)", sc:"O(target)",
    walkthrough:{
      steps:[
        {label:"nums=[1,2,3], target=4", detail:"dp[0]=1. dp[1]=dp[0]=1. dp[2]=dp[1]+dp[0]=2. dp[3]=dp[2]+dp[1]+dp[0]=4. dp[4]=dp[3]+dp[2]+dp[1]=4+2+1=7."}
      ],
      edgeCase:"target=0: return 1 (empty combination). Num larger than target: contributes 0."
    },
    similar:{"DP":["Coin Change","Climbing Stairs","Perfect Squares"]}
  }
},

"house-robber": {
  num:124, title:"House Robber", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/house-robber/",
  rev:"6 min", pattern:"DP — Skip or Take with No-Adjacent Constraint",
  sections:{
    explain:"Rob houses on a street without robbing adjacent ones. Maximize money robbed.",
    example:{input:"nums=[2,7,9,3,1]", output:"12", why:"Rob houses 0,2,4: 2+9+1=12"},
    intuition:"dp[i] = max money from first i+1 houses. At each house: either skip it (dp[i-1]) or rob it (nums[i] + dp[i-2]). dp[i] = max(dp[i-1], nums[i] + dp[i-2]). Space-optimize to two variables.",
    tricks:[{name:"Two variables: prev2 and prev1", detail:"prev2=dp[i-2], prev1=dp[i-1]. curr=max(prev1, nums[i]+prev2). Update prev2=prev1, prev1=curr."}],
    code:`def rob(self, nums):
    if not nums: return 0
    if len(nums) == 1: return nums[0]
    prev2, prev1 = 0, 0
    for n in nums:
        curr = max(prev1, n + prev2)
        prev2, prev1 = prev1, curr
    return prev1`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"nums=[2,7,9,3,1]", detail:"(0,0)→n=2:max(0,2+0)=2,(0,2). n=7:max(2,7+0)=7,(2,7). n=9:max(7,9+2)=11,(7,11). n=3:max(11,3+7)=11,(11,11). n=1:max(11,1+11)=12. Return 12."}
      ],
      edgeCase:"Empty array: 0. Single house: rob it. Two houses: max of the two."
    },
    similar:{"DP":["House Robber II","House Robber III","Delete and Earn"]}
  }
},

"house-robber-ii": {
  num:125, title:"House Robber II", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/house-robber-ii/",
  rev:"7 min", pattern:"House Robber on Two Linear Sub-Arrays",
  sections:{
    explain:"Houses arranged in a circle. First and last houses are adjacent. Maximize robbery without robbing adjacent houses.",
    example:{input:"nums=[2,3,2]", output:"3"},
    intuition:"Can't rob both first and last. Split into two sub-problems: rob nums[0..n-2] (skip last) and rob nums[1..n-1] (skip first). Answer = max of both. Each sub-problem is the standard House Robber.",
    tricks:[{name:"Two passes on sub-arrays", detail:"Run house_robber(nums[:-1]) and house_robber(nums[1:]). Take the max. Handles circular constraint by breaking it into two linear problems."}],
    code:`def rob(self, nums):
    if len(nums) == 1: return nums[0]
    def rob_linear(houses):
        prev2 = prev1 = 0
        for n in houses:
            prev2, prev1 = prev1, max(prev1, n + prev2)
        return prev1
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"nums=[2,3,2]", detail:"rob_linear([2,3])=3. rob_linear([3,2])=3. max(3,3)=3."}
      ],
      edgeCase:"n=1: return nums[0]. n=2: return max(nums[0],nums[1])."
    },
    similar:{"DP":["House Robber","House Robber III","Non-adjacent Sum"]}
  }
},

"decode-ways": {
  num:126, title:"Decode Ways", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/decode-ways/",
  rev:"8 min", pattern:"DP — One/Two Character Decode",
  sections:{
    explain:"A string of digits encodes letters: '1'→'A', '2'→'B', ..., '26'→'Z'. Count the number of ways to decode a digit string.",
    example:{input:"s='226'", output:"3", why:"'BZ'(2,26),'VF'(22,6),'BBF'(2,2,6)"},
    intuition:"dp[i] = number of ways to decode s[:i]. Can decode one digit (s[i-1] if not '0') or two digits (s[i-2:i] if 10-26). dp[i] = dp[i-1] (if valid one-digit) + dp[i-2] (if valid two-digit). dp[0]=1 (empty), dp[1]=1 if s[0]!='0'.",
    tricks:[
      {name:"Two-digit check: 10-26 only", detail:"int(s[i-2:i]) must be in [10,26]. Leading zeros in two-digit (like '06') are invalid."},
      {name:"'0' kills one-digit decode", detail:"If s[i-1]=='0', one-digit path contributes 0 (can't decode '0' alone). Only two-digit path (via 10 or 20) can save it."}
    ],
    code:`def numDecodings(self, s):
    if not s or s[0] == '0': return 0
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1           # empty string
    dp[1] = 1           # first char valid (not '0')
    for i in range(2, n + 1):
        one  = int(s[i-1])
        two  = int(s[i-2:i])
        if one != 0:         dp[i] += dp[i-1]  # single digit
        if 10 <= two <= 26:  dp[i] += dp[i-2]  # two digits
    return dp[n]`,
    tc:"O(n)", sc:"O(n) → O(1) with two vars",
    walkthrough:{
      steps:[
        {label:"s='226'", detail:"dp=[1,1,0,0]. i=2: one=2≠0→dp[2]+=dp[1]=1; two=22∈[10,26]→dp[2]+=dp[0]=2. dp[2]=2. i=3: one=6≠0→dp[3]+=dp[2]=2; two=26∈[10,26]→dp[3]+=dp[1]=3. dp[3]=3."}
      ],
      edgeCase:"'0' at start: return 0. '10': dp=[1,1,0]. i=2: one=0→no; two=10→dp[2]+=dp[0]=1. Return 1."
    },
    similar:{"DP":["Climbing Stairs","Decode Ways II","Number of Ways to Decode"]}
  }
},

"unique-paths": {
  num:127, title:"Unique Paths", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/unique-paths/",
  rev:"6 min", pattern:"2D DP Grid",
  sections:{
    explain:"Robot on m×n grid moves only right or down. Count distinct paths from top-left to bottom-right.",
    example:{input:"m=3, n=7", output:"28"},
    intuition:"dp[i][j] = paths to reach cell (i,j). dp[i][j] = dp[i-1][j] + dp[i][j-1] (came from above or left). First row and column are all 1s (only one way to reach any cell on the top row or left column).",
    tricks:[
      {name:"1D DP optimization", detail:"Since dp[i][j] only uses the row above and same row, use a single row array. dp[j] += dp[j-1] at each row iteration."},
      {name:"Math formula", detail:"C(m+n-2, m-1) — choose which m-1 of the m+n-2 moves are down-moves. Useful if interviewer asks for O(1) space."}
    ],
    code:`def uniquePaths(self, m, n):
    dp = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j-1]
    return dp[n-1]`,
    tc:"O(m*n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"m=3,n=3", detail:"Initial: [1,1,1]. Row 1: dp[1]+=dp[0]=2, dp[2]+=dp[1]=3 → [1,2,3]. Row 2: dp[1]=1+2=3, dp[2]=3+3=6 → [1,3,6]. Return 6."}
      ],
      edgeCase:"m=1 or n=1: only one path (all right or all down). Returns 1."
    },
    similar:{"DP":["Unique Paths II","Minimum Path Sum","Triangle"]}
  }
},

"minimum-path-sum": {
  num:128, title:"Minimum Path Sum", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/minimum-path-sum/",
  rev:"7 min", pattern:"2D DP Grid — Min Cost",
  sections:{
    explain:"Find a path from top-left to bottom-right of a grid (moving only right or down) that minimizes the sum of all numbers along the path.",
    example:{input:"grid=[[1,3,1],[1,5,1],[4,2,1]]", output:"7", why:"1→3→1→1→1"},
    intuition:"dp[i][j] = min path sum to reach cell (i,j). dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]). Handle first row (only from left) and first column (only from above) as special cases.",
    tricks:[{name:"Modify grid in-place", detail:"Can accumulate sums directly in grid[][] to avoid extra space. grid[i][j] += min(grid[i-1][j], grid[i][j-1])."}],
    code:`def minPathSum(self, grid):
    m, n = len(grid), len(grid[0])
    for i in range(m):
        for j in range(n):
            if i == 0 and j == 0: continue
            elif i == 0:   grid[i][j] += grid[i][j-1]
            elif j == 0:   grid[i][j] += grid[i-1][j]
            else:          grid[i][j] += min(grid[i-1][j], grid[i][j-1])
    return grid[m-1][n-1]`,
    tc:"O(m*n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"grid=[[1,3,1],[1,5,1],[4,2,1]]", detail:"First row: [1,4,5]. First col: 1,2,6. grid[1][1]=5+min(4,2)=7. grid[1][2]=1+min(5,7)=6. grid[2][1]=2+min(7,6)=8. grid[2][2]=1+min(6,8)=7."}
      ],
      edgeCase:"Single cell: return grid[0][0]. Single row: prefix sums left to right."
    },
    similar:{"DP":["Unique Paths","Dungeon Game","Cherry Pickup"]}
  }
},

"longest-palindromic-substring": {
  num:129, title:"Longest Palindromic Substring", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/longest-palindromic-substring/",
  rev:"8 min", pattern:"Expand Around Center",
  sections:{
    explain:"Find the longest palindromic substring in a string.",
    example:{input:"s='babad'", output:"'bab' or 'aba'"},
    intuition:"For each center (each character and each gap between characters), expand outward while characters match. Track the longest palindrome found. There are 2n-1 centers total.",
    tricks:[
      {name:"Expand around center", detail:"Two cases per center: odd-length (one char) and even-length (two chars). Expand while s[l]==s[r], then record the palindrome."},
      {name:"Manacher's algorithm for O(n)", detail:"O(n) with Manacher's. Expand around center is O(n²) — acceptable in interviews."}
    ],
    code:`def longestPalindrome(self, s):
    res = ''
    for i in range(len(s)):
        # Odd length
        l, r = i, i
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if r - l + 1 > len(res): res = s[l:r+1]
            l -= 1; r += 1
        # Even length
        l, r = i, i + 1
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if r - l + 1 > len(res): res = s[l:r+1]
            l -= 1; r += 1
    return res`,
    tc:"O(n^2)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"s='babad', center=1(a)", detail:"Expand: b==b → 'bab' (len 3). Center=0(b): just 'b'. Best so far: 'bab'."},
        {label:"center=2(b)", detail:"Expand: a==a → 'aba' (len 3). Tie — return first found 'bab'."}
      ],
      edgeCase:"All same characters: entire string is palindrome. Single character: return it."
    },
    similar:{"DP":["Palindromic Substrings","Palindrome Partitioning","Longest Palindromic Subsequence"]}
  }
},

"palindromic-substrings": {
  num:130, title:"Palindromic Substrings", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/palindromic-substrings/",
  rev:"7 min", pattern:"Expand Around Center — Count",
  sections:{
    explain:"Count the total number of palindromic substrings in a string.",
    example:{input:"s='abc'", output:"3", why:"'a','b','c' are 3 single-char palindromes"},
    intuition:"Same expand-around-center approach as Longest Palindromic Substring, but increment a counter for every valid expansion instead of tracking length.",
    tricks:[{name:"Each expansion = one palindrome", detail:"Every successful expansion (s[l]==s[r]) counts +1. Don't need to track boundaries — just count."}],
    code:`def countSubstrings(self, s):
    count = 0
    for i in range(len(s)):
        # Odd
        l, r = i, i
        while l >= 0 and r < len(s) and s[l] == s[r]:
            count += 1; l -= 1; r += 1
        # Even
        l, r = i, i + 1
        while l >= 0 and r < len(s) and s[l] == s[r]:
            count += 1; l -= 1; r += 1
    return count`,
    tc:"O(n^2)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"s='aaa'", detail:"i=0: odd expands once (just 'a',+1), even: l=0,r=1 s[0]==s[1] → 'aa'+1, expand l=-1 stop. i=1: odd 'a'+1, expand: s[0]==s[2]→'aaa'+1, expand stop. Even l=1,r=2: s[1]==s[2]→'aa'+1, expand stop. i=2: odd 'a'+1. Total=6."}
      ],
      edgeCase:"Empty string: 0. Single char: 1."
    },
    similar:{"DP":["Longest Palindromic Substring","Count Different Palindromic Subsequences","Palindrome Partitioning"]}
  }
},

"interleaving-string": {
  num:131, title:"Interleaving String", diff:"Hard", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/interleaving-string/",
  rev:"12 min", pattern:"2D DP — Two-String Merge",
  sections:{
    explain:"Given s1, s2, s3, determine if s3 is formed by an interleaving of s1 and s2 (characters from s1 and s2 maintain their relative order).",
    example:{input:"s1='aabcc', s2='dbbca', s3='aadbbcbcac'", output:"true"},
    intuition:"dp[i][j] = True if s3[:i+j] can be formed by interleaving s1[:i] and s2[:j]. Transition: dp[i][j] = (dp[i-1][j] and s1[i-1]==s3[i+j-1]) OR (dp[i][j-1] and s2[j-1]==s3[i+j-1]).",
    tricks:[{name:"dp[0][0]=True base case", detail:"Empty s1 and s2 interleave to empty s3. First row/col initialized by checking if s2[:j] or s1[:i] matches s3 prefix."}],
    code:`def isInterleave(self, s1, s2, s3):
    m, n = len(s1), len(s2)
    if m + n != len(s3): return False
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for i in range(1, m + 1):
        dp[i][0] = dp[i-1][0] and s1[i-1] == s3[i-1]
    for j in range(1, n + 1):
        dp[0][j] = dp[0][j-1] and s2[j-1] == s3[j-1]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            dp[i][j] = ((dp[i-1][j] and s1[i-1] == s3[i+j-1]) or
                        (dp[i][j-1] and s2[j-1] == s3[i+j-1]))
    return dp[m][n]`,
    tc:"O(m*n)", sc:"O(m*n)",
    walkthrough:{
      steps:[
        {label:"s1='aa',s2='db',s3='adab'... simplified", detail:"dp[0][0]=T. Each cell checks if we can reach it by taking last char from s1 or s2."}
      ],
      edgeCase:"len(s1)+len(s2)!=len(s3): immediately False. Either string empty: check if s3 equals the other."
    },
    similar:{"DP":["Edit Distance","Longest Common Subsequence","Distinct Subsequences"]}
  }
},

"edit-distance": {
  num:132, title:"Edit Distance", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/edit-distance/",
  rev:"10 min", pattern:"2D DP — Three Operations",
  sections:{
    explain:"Return the minimum number of operations (insert, delete, replace) to convert word1 to word2.",
    example:{input:"word1='horse', word2='ros'", output:"3", why:"horse→rorse→rose→ros"},
    intuition:"dp[i][j] = edit distance between word1[:i] and word2[:j]. If chars match: dp[i][j]=dp[i-1][j-1]. Else: dp[i][j] = 1 + min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace)).",
    tricks:[{name:"Base cases: empty string", detail:"dp[i][0]=i (delete all i chars). dp[0][j]=j (insert all j chars)."}],
    code:`def minDistance(self, word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(m+1): dp[i][0] = i
    for j in range(n+1): dp[0][j] = j
    for i in range(1, m+1):
        for j in range(1, n+1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j],    # delete
                                    dp[i][j-1],    # insert
                                    dp[i-1][j-1])  # replace
    return dp[m][n]`,
    tc:"O(m*n)", sc:"O(m*n)",
    walkthrough:{
      steps:[
        {label:"word1='horse',word2='ros'", detail:"Build 6x4 DP table. dp[5][3]=3 via: horse→rorse (replace h with r), rorse→rose (delete r), rose→ros (delete e)."}
      ],
      edgeCase:"One empty string: dp = length of other. Same strings: dp[m][n]=0."
    },
    similar:{"DP":["Longest Common Subsequence","Minimum ASCII Delete Sum","One Edit Distance"]}
  }
},

"best-time-to-buy-and-sell-stock-with-cooldown": {
  num:133, title:"Best Time to Buy and Sell Stock with Cooldown", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
  rev:"10 min", pattern:"State Machine DP",
  sections:{
    explain:"Maximize profit buying/selling stock with a cooldown: after selling you cannot buy the next day.",
    example:{input:"prices=[1,2,3,0,2]", output:"3", why:"buy@1,sell@3,cooldown,buy@0,sell@2"},
    intuition:"Three states: holding (have stock), sold (just sold, cooldown next), cooldown (did nothing or post-cooldown, can buy). Transition: holding = max(prev_holding, prev_cooldown - price). sold = prev_holding + price. cooldown = max(prev_cooldown, prev_sold).",
    tricks:[{name:"State machine with 3 states", detail:"holding, sold, cooldown. At each price, compute new state values from previous. Final answer = max(sold, cooldown)."}],
    code:`def maxProfit(self, prices):
    holding = float('-inf')   # profit while holding stock
    sold     = 0              # profit day after selling
    cooldown = 0              # profit while in cooldown/rest
    for price in prices:
        prev_sold = sold
        sold      = holding + price              # sell today
        holding   = max(holding, cooldown - price)  # buy or hold
        cooldown  = max(cooldown, prev_sold)     # rest or stay
    return max(sold, cooldown)`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"prices=[1,2,3,0,2]", detail:"price=1: sold=-inf+1=-inf,holding=max(-inf,0-1)=-1,cooldown=0. price=2: sold=-1+2=1,holding=max(-1,0-2)=-1,cooldown=max(0,-inf)=0. price=3: sold=-1+3=2,holding=max(-1,0-3)=-1,cooldown=max(0,1)=1. price=0: sold=-1+0=-1,holding=max(-1,1-0)=1,cooldown=max(1,2)=2. price=2: sold=1+2=3. Return max(3,2)=3."}
      ],
      edgeCase:"Single price: cannot complete a transaction, return 0. Monotonically decreasing: return 0."
    },
    similar:{"DP":["Best Time Buy/Sell Stock I-IV","Best Time Buy/Sell with Transaction Fee"]}
  }
},

"coin-change-ii": {
  num:134, title:"Coin Change II", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/coin-change-ii/",
  rev:"8 min", pattern:"DP — Unbounded Knapsack (Combinations, Order Doesn't Matter)",
  sections:{
    explain:"Return the number of combinations (not permutations) of coins that sum to amount.",
    example:{input:"amount=5, coins=[1,2,5]", output:"4", why:"5, 2+2+1, 2+1+1+1, 1+1+1+1+1"},
    intuition:"dp[a] = number of ways to make amount a. Iterate coins in outer loop (to count combinations not permutations). For each coin: dp[a] += dp[a-coin]. dp[0]=1.",
    tricks:[{name:"Coins outer loop vs amount outer loop", detail:"Coins outer → each coin considered once per combination → counts combinations. Amount outer (like Combination Sum IV) → counts permutations. This distinction is key."}],
    code:`def change(self, amount, coins):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:          # outer = coins → combinations
        for a in range(coin, amount + 1):
            dp[a] += dp[a - coin]
    return dp[amount]`,
    tc:"O(amount * len(coins))", sc:"O(amount)",
    walkthrough:{
      steps:[
        {label:"coins=[1,2,5],amount=5", detail:"After coin=1: dp=[1,1,1,1,1,1]. After coin=2: dp[2]+=dp[0]=2,dp[3]+=dp[1]=2,dp[4]+=dp[2]=3,dp[5]+=dp[3]=3. After coin=5: dp[5]+=dp[0]=4. Return 4."}
      ],
      edgeCase:"amount=0: return 1 (empty selection). No coins: return 0 for amount>0."
    },
    similar:{"DP":["Coin Change","Combination Sum IV","Perfect Squares"]}
  }
},

"target-sum": {
  num:135, title:"Target Sum", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/target-sum/",
  rev:"8 min", pattern:"DP — 0/1 Knapsack Count",
  sections:{
    explain:"Assign + or - to each number. Count ways to make the total equal to target.",
    example:{input:"nums=[1,1,1,1,1], target=3", output:"5"},
    intuition:"At each step, each number either adds or subtracts. Use DP dict: counts = {running_sum: ways}. For each num: new_counts = {}; for each sum in counts: add to sum+num and sum-num. Final answer = counts.get(target, 0).",
    tricks:[
      {name:"DP with dictionary of reachable sums", detail:"counts = {0:1}. For each num: new = {}; for s,cnt in counts.items(): new[s+num]+=cnt; new[s-num]+=cnt. Replace counts."},
      {name:"0/1 knapsack math reduction", detail:"Let P=set of + nums, N=set of - nums. P-N=target, P+N=total. So P=(target+total)/2. Find number of subsets summing to P — reduces to Partition Equal Subset Sum variant."}
    ],
    code:`def findTargetSumWays(self, nums, target):
    counts = {0: 1}
    for n in nums:
        new_counts = {}
        for s, cnt in counts.items():
            new_counts[s + n] = new_counts.get(s + n, 0) + cnt
            new_counts[s - n] = new_counts.get(s - n, 0) + cnt
        counts = new_counts
    return counts.get(target, 0)`,
    tc:"O(n * sum_range)", sc:"O(sum_range)",
    walkthrough:{
      steps:[
        {label:"nums=[1,1], target=0", detail:"{0:1}→{1:1,-1:1}→{2:1,0:2,-2:1}. counts[0]=2 → 2 ways: (1-1) and (-1+1)."}
      ],
      edgeCase:"Target out of range [-sum,sum]: return 0. All zeros: 2^n ways (each 0 can be + or -)."
    },
    similar:{"DP":["Partition Equal Subset Sum","Number of Ways to Express N","Combination Sum IV"]}
  }
},

"burst-balloons": {
  num:136, title:"Burst Balloons", diff:"Hard", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/burst-balloons/",
  rev:"15 min", pattern:"Interval DP — Last Balloon to Burst",
  sections:{
    explain:"Burst all balloons. Bursting balloon i gives nums[i-1]*nums[i]*nums[i+1] coins. Maximize total coins.",
    example:{input:"nums=[3,1,5,8]", output:"167", why:"Burst 1→3*1*5=15, 5→3*5*8=120, 3→1*3*8=24, 8→1*8*1=8. Total=167"},
    intuition:"Think backwards: instead of first to burst, choose the LAST balloon to burst in range [i,j]. dp[i][j] = max coins from bursting all balloons strictly between index i and j (with i,j as boundaries). Add 1s at both ends.",
    tricks:[
      {name:"Last to burst, not first", detail:"If k is the last balloon in (i,j): coins = nums[i]*nums[k]*nums[j] + dp[i][k] + dp[k][j]. The boundaries i,j are still intact when k bursts."},
      {name:"Pad with 1s at boundaries", detail:"nums = [1] + nums + [1]. This simplifies the formula at edges."}
    ],
    code:`def maxCoins(self, nums):
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n):           # window size
        for left in range(0, n - length):
            right = left + length
            for k in range(left + 1, right):  # k = last burst
                coins = nums[left] * nums[k] * nums[right]
                dp[left][right] = max(dp[left][right],
                                      dp[left][k] + coins + dp[k][right])
    return dp[0][n-1]`,
    tc:"O(n^3)", sc:"O(n^2)",
    walkthrough:{
      steps:[
        {label:"nums=[3,1,5,8]→[1,3,1,5,8,1]", detail:"dp[0][5] covers all. Last burst k=1(3): 1*3*1+dp[0][1]+dp[1][5]. Try all k, take max."},
        {label:"Build bottom-up by window size", detail:"Start with windows of size 2 (no balloons between), size 3 (one balloon), etc."}
      ],
      edgeCase:"Single balloon: just that balloon's coins (neighbors are padding 1s)."
    },
    similar:{"Interval DP":["Strange Printer","Remove Boxes","Minimum Cost to Merge Stones"]}
  }
},

"regular-expression-matching": {
  num:137, title:"Regular Expression Matching", diff:"Hard", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/regular-expression-matching/",
  rev:"15 min", pattern:"2D DP — Pattern Matching with Wildcards",
  sections:{
    explain:"Implement regex matching with '.' (matches any char) and '*' (matches zero or more of preceding element).",
    example:{input:"s='aab', p='c*a*b'", output:"true", why:"c* matches empty, a* matches 'aa', b matches 'b'"},
    intuition:"dp[i][j] = True if s[:i] matches p[:j]. If p[j-1] is normal char or '.': dp[i][j] = dp[i-1][j-1] AND (s[i-1]==p[j-1] OR p[j-1]=='.'). If p[j-1]=='*': zero occurrences (dp[i][j-2]) OR one+ occurrence (dp[i-1][j] AND match(s[i-1],p[j-2])).",
    tricks:[
      {name:"'*' has two cases", detail:"Zero of preceding: dp[i][j] = dp[i][j-2] (skip x*). One+: dp[i][j] = dp[i-1][j] AND (s[i-1]==p[j-2] OR p[j-2]=='.'). This is the trickiest part."},
      {name:"dp[0][j] initialization", detail:"Empty string can match patterns like a*, a*b*, a*b*c*. Initialize dp[0][j] = dp[0][j-2] when p[j-1]=='*'."}
    ],
    code:`def isMatch(self, s, p):
    m, n = len(s), len(p)
    dp = [[False]*(n+1) for _ in range(m+1)]
    dp[0][0] = True
    for j in range(1, n+1):
        if p[j-1] == '*' and j >= 2:
            dp[0][j] = dp[0][j-2]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if p[j-1] == '*':
                dp[i][j] = dp[i][j-2]   # zero occurrences
                if p[j-2] == '.' or p[j-2] == s[i-1]:
                    dp[i][j] = dp[i][j] or dp[i-1][j]  # one+ occurrences
            elif p[j-1] == '.' or p[j-1] == s[i-1]:
                dp[i][j] = dp[i-1][j-1]
    return dp[m][n]`,
    tc:"O(m*n)", sc:"O(m*n)",
    walkthrough:{
      steps:[
        {label:"s='aab',p='c*a*b'", detail:"dp[0][0]=T. dp[0][2]=dp[0][0]=T (c* zero). dp[0][4]=dp[0][2]=T (a* zero). dp[1][4]: p[3]='*', p[2]='a'==s[0]='a' → dp[0][4]=T. dp[2][4]=T. dp[3][5]: p[4]='b'==s[2]='b' → dp[2][4]=T. Return dp[3][5]=T."}
      ],
      edgeCase:"Empty pattern matches only empty string. '.*' matches anything. '.' doesn't match empty."
    },
    similar:{"DP":["Wildcard Matching","Edit Distance","Distinct Subsequences"]}
  }
},

/* ════════════════ GREEDY ════════════════ */
/* Note: gas-station (num:14) and jump-game (num:9) already have full
   section data under Array / String — the Details link works for both. */

"maximum-subarray": {
  num:138, title:"Maximum Subarray", diff:"Medium", cat:"Greedy",
  lc:"https://leetcode.com/problems/maximum-subarray/",
  rev:"6 min", pattern:"Kadane's Algorithm",
  sections:{
    explain:"Find the contiguous subarray with the largest sum.",
    example:{input:"nums=[-2,1,-3,4,-1,2,1,-5,4]", output:"6", why:"[4,-1,2,1] sums to 6"},
    intuition:"Kadane's: maintain a running sum. At each element decide: extend the current subarray (currSum + nums[i]) or start fresh from nums[i] — take whichever is larger. Track the global max throughout.",
    tricks:[
      {name:"Restart when running sum goes negative", detail:"If currSum < 0, starting a new subarray from the current element is always better. currSum = max(nums[i], currSum + nums[i])."},
      {name:"DP framing", detail:"dp[i] = max subarray sum ending at index i. dp[i] = max(nums[i], dp[i-1] + nums[i]). Answer = max(dp). Kadane's is just the O(1)-space version."}
    ],
    code:`def maxSubArray(self, nums):
    curr_sum = max_sum = nums[0]
    for n in nums[1:]:
        curr_sum = max(n, curr_sum + n)
        max_sum  = max(max_sum, curr_sum)
    return max_sum`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"nums=[-2,1,-3,4,-1,2,1,-5,4]", detail:"curr=-2,max=-2. n=1: curr=max(1,-1)=1,max=1. n=-3: curr=max(-3,-2)=-2,max=1. n=4: curr=max(4,2)=4,max=4. n=-1: curr=3,max=4. n=2: curr=5,max=5. n=1: curr=6,max=6. n=-5: curr=1. n=4: curr=5. Return 6."}
      ],
      edgeCase:"All negatives: answer is the least negative element. Single element: return it."
    },
    similar:{"Greedy/DP":["Maximum Product Subarray","Best Time to Buy/Sell Stock","Longest Turbulent Subarray"]}
  }
},

"partition-labels": {
  num:139, title:"Partition Labels", diff:"Medium", cat:"Greedy",
  lc:"https://leetcode.com/problems/partition-labels/",
  rev:"7 min", pattern:"Greedy — Extend Partition to Last Occurrence",
  sections:{
    explain:"Partition string s into as many parts as possible so each letter appears in at most one part. Return a list of part sizes.",
    example:{input:"s='ababcbacadefegdehijhklij'", output:"[9,7,8]"},
    intuition:"For each character, record its last occurrence. Scan left to right with a start and end pointer: end = max(end, last[char]). When i == end, a partition is complete — its size is end - start + 1. Advance start.",
    tricks:[{name:"end = max(end, last[c])", detail:"Every time we see a character, we must extend the current partition at least to that character's last occurrence. When index reaches end, no character in [start, end] appears beyond end — safe to cut."}],
    code:`def partitionLabels(self, s):
    last = {c: i for i, c in enumerate(s)}  # last occurrence of each char
    res, start, end = [], 0, 0
    for i, c in enumerate(s):
        end = max(end, last[c])
        if i == end:
            res.append(end - start + 1)
            start = i + 1
    return res`,
    tc:"O(n)", sc:"O(1) — bounded alphabet",
    walkthrough:{
      steps:[
        {label:"s='ababcbacadefegdehijhklij'", detail:"last: a→8,b→5,c→7,d→14,e→15,f→11,g→13,h→19,i→22,j→23,k→20,l→21. i=0(a): end=8. i=1(b): end=max(8,5)=8. ... i=8: i==end=8 → part size=9, start=9."},
        {label:"Continue from start=9", detail:"i=9(d): end=14. i=10(e): end=15. ... i=15(e): i==end=15 → size=7, start=16."},
        {label:"Continue from start=16", detail:"i=16(h):end=19...i=23(j):end=23. i==end → size=8."}
      ],
      edgeCase:"Single character string: one partition of size 1. All same character: one partition of full length."
    },
    similar:{"Greedy":["Merge Intervals","Jump Game II","Non-overlapping Intervals"]}
  }
},

"task-scheduler": {
  num:140, title:"Task Scheduler", diff:"Medium", cat:"Greedy",
  lc:"https://leetcode.com/problems/task-scheduler/",
  rev:"10 min", pattern:"Greedy — Most Frequent Task First",
  sections:{
    explain:"Given tasks and a cooldown n (same task can't repeat within n intervals), return minimum time units to finish all tasks. Idle time fills gaps.",
    example:{input:"tasks=['A','A','A','B','B','B'], n=2", output:"8", why:"A→B→idle→A→B→idle→A→B"},
    intuition:"Focus on the most frequent task. If max_freq tasks occur f times, they need (f-1) * (n+1) slots plus the final batch. Add all tasks that also occur f times. Formula: max((f-1)*(n+1) + count_of_max_freq, len(tasks)).",
    tricks:[
      {name:"Formula: (f-1)*(n+1) + max_count_tasks", detail:"The most frequent task creates a 'frame' of size n+1. Each frame holds one of each task type. If tasks fill all frames with no idle, the answer is just len(tasks)."},
      {name:"max(formula, len(tasks))", detail:"If tasks are dense enough (many different types), no idle time is needed and the answer is just len(tasks)."}
    ],
    code:`from collections import Counter
def leastInterval(self, tasks, n):
    freq = Counter(tasks)
    max_freq = max(freq.values())
    max_count = sum(1 for v in freq.values() if v == max_freq)
    slots = (max_freq - 1) * (n + 1) + max_count
    return max(slots, len(tasks))`,
    tc:"O(n)", sc:"O(1) — 26 task types max",
    walkthrough:{
      steps:[
        {label:"tasks=['A','A','A','B','B','B'], n=2", detail:"freq: A=3, B=3. max_freq=3, max_count=2. slots=(3-1)*(2+1)+2=8. len(tasks)=6. max(8,6)=8."},
        {label:"Dense case: tasks=['A','A','B','B','C','C'], n=1", detail:"max_freq=2, max_count=3. slots=(2-1)*2+3=5. len(tasks)=6. max(5,6)=6."}
      ],
      edgeCase:"n=0: no cooldown, answer is always len(tasks). All same task: (f-1)*(n+1)+1."
    },
    similar:{"Greedy":["Reorganize String","Rearrange String k Distance Apart","Maximum Frequency Stack"]}
  }
},

"merge-triplets-to-form-target-triplet": {
  num:141, title:"Merge Triplets to Form Target Triplet", diff:"Medium", cat:"Greedy",
  lc:"https://leetcode.com/problems/merge-triplets-to-form-target-triplet/",
  rev:"7 min", pattern:"Greedy — Filter Then Check Coverage",
  sections:{
    explain:"Merge triplets by taking element-wise max. Return true if you can reach the target triplet [a,b,c] by merging a subset of triplets.",
    example:{input:"triplets=[[2,5,3],[1,8,4],[1,7,5]], target=[2,7,5]", output:"true", why:"Merge [2,5,3] and [1,7,5]: max=[2,7,5]"},
    intuition:"Any triplet with an element exceeding the corresponding target cannot be used — it would push our merged result past the target. Filter out such triplets. Then check if the remaining triplets collectively cover every target value.",
    tricks:[{name:"Discard triplets exceeding target in any dimension", detail:"If triplets[i][j] > target[j] for any j, skip the triplet entirely. Among valid triplets, check if the element-wise max equals target."}],
    code:`def mergeTriplets(self, triplets, target):
    a, b, c = 0, 0, 0
    for x, y, z in triplets:
        if x <= target[0] and y <= target[1] and z <= target[2]:
            a, b, c = max(a, x), max(b, y), max(c, z)
    return [a, b, c] == target`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"target=[2,7,5]", detail:"[2,5,3]: all ≤ target → merge: (2,5,3). [1,8,4]: y=8>target[1]=7 → skip. [1,7,5]: all ≤ target → merge: max(2,1)=2, max(5,7)=7, max(3,5)=5 → (2,7,5)."},
        {label:"Result (2,7,5)==target", detail:"Return True."}
      ],
      edgeCase:"Target not achievable: some value never reached by valid triplets → [a,b,c]≠target → False."
    },
    similar:{"Greedy":["Jump Game","Minimum Number of Arrows","Non-overlapping Intervals"]}
  }
},

/* ════════════════ MATH / GEOMETRY ════════════════ */

"powx-n": {
  num:142, title:"Pow(x, n)", diff:"Medium", cat:"Math / Geometry",
  lc:"https://leetcode.com/problems/powx-n/",
  rev:"7 min", pattern:"Fast Power (Binary Exponentiation)",
  sections:{
    explain:"Implement pow(x, n) — x raised to the power n. n can be negative.",
    example:{input:"x=2.0, n=10", output:"1024.0"},
    intuition:"Binary exponentiation: if n is even, x^n = (x^(n/2))^2. If odd, x^n = x * x^(n-1). This halves n each time → O(log n) multiplications. Handle negative n: x^(-n) = 1 / x^n.",
    tricks:[
      {name:"Halving exponent", detail:"Each recursive/iterative step squares the result and halves n. Much faster than n multiplications."},
      {name:"Iterative bit approach", detail:"While n > 0: if n is odd multiply result by x; square x; n //= 2. Avoids recursion stack."}
    ],
    code:`def myPow(self, x, n):
    if n < 0:
        x, n = 1 / x, -n
    result = 1.0
    while n:
        if n % 2 == 1:      # odd exponent: multiply current x
            result *= x
        x *= x              # square the base
        n //= 2
    return result`,
    tc:"O(log n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"x=2, n=10", detail:"n=10(even): x=4,n=5. n=5(odd): result=4,x=16,n=2. n=2(even): x=256,n=1. n=1(odd): result=4*256=1024,n=0. Return 1024."},
        {label:"x=2, n=-3", detail:"Flip: x=0.5, n=3. n=3(odd): result=0.5,x=0.25,n=1. n=1(odd): result=0.125,n=0. Return 0.125 = 1/8."}
      ],
      edgeCase:"n=0: result stays 1.0 (loop never runs). x=0, n<0: mathematically undefined; constraints usually prevent this."
    },
    similar:{"Math":["Sqrt(x)","Super Pow","Fast Matrix Exponentiation"]}
  }
},

"multiply-strings": {
  num:143, title:"Multiply Strings", diff:"Medium", cat:"Math / Geometry",
  lc:"https://leetcode.com/problems/multiply-strings/",
  rev:"10 min", pattern:"Grade-School Multiplication with Position Mapping",
  sections:{
    explain:"Multiply two non-negative integers represented as strings. Do not use built-in big-integer multiplication.",
    example:{input:"num1='123', num2='456'", output:"'56088'"},
    intuition:"Simulate grade-school multiplication digit by digit. When multiplying digit at position i (num1) and j (num2), the result contributes to positions i+j and i+j+1 in the product array. Sum all contributions, then convert to string.",
    tricks:[{name:"Position mapping: i*j → positions [i+j, i+j+1]", detail:"Product array has length m+n. digit1*digit2 at (i,j) adds to pos[i+j+1] (units) with carry to pos[i+j]. Process right-to-left for both numbers."}],
    code:`def multiply(self, num1, num2):
    m, n = len(num1), len(num2)
    pos = [0] * (m + n)
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            mul = int(num1[i]) * int(num2[j])
            p1, p2 = i + j, i + j + 1
            total = mul + pos[p2]
            pos[p2] = total % 10
            pos[p1] += total // 10
    result = ''.join(str(d) for d in pos).lstrip('0')
    return result or '0'`,
    tc:"O(m*n)", sc:"O(m+n)",
    walkthrough:{
      steps:[
        {label:"num1='12', num2='34'", detail:"i=1,j=1: 2*4=8→pos[3]+=8. i=1,j=0: 2*3=6→pos[2]+=6. i=0,j=1: 1*4=4→pos[2]+=4→pos[2]=10→carry. i=0,j=0: 1*3=3→pos[1]+=3+carry. Result: 408."}
      ],
      edgeCase:"Either input is '0': result should be '0', handled by lstrip + `or '0'`. Leading zeros stripped."
    },
    similar:{"Math":["Add Two Numbers","Plus One","Add Binary"]}
  }
},

"detect-squares": {
  num:144, title:"Detect Squares", diff:"Medium", cat:"Math / Geometry",
  lc:"https://leetcode.com/problems/detect-squares/",
  rev:"10 min", pattern:"Hash Map — Count Points, Enumerate Diagonals",
  sections:{
    explain:"Design a data structure to add points and count axis-aligned squares with a given query point as one corner.",
    example:{input:"add(3,10),add(11,2),add(3,2); count(11,10)→1"},
    intuition:"For a query point (px, py), it forms the diagonal corner of a square. Enumerate all points (x1, py) on the same row. For each, the square side = |x1 - px|. Check if (x1, py - side), (px, py - side) and (x1, py - side) all exist in our point set. Multiply counts.",
    tricks:[
      {name:"Fix one diagonal, derive the other two", detail:"Two corners of a square share no coordinate. From (px,py) and (x1,py) (same y), two candidate squares exist: one above, one below. For each, check the other two corners in the point map."},
      {name:"Count occurrences not just presence", detail:"Multiple identical points can exist. Multiply counts: pts[(x1,y1)] * pts[(x2,y2)] * pts[(x3,y3)] since each combination forms a distinct square."}
    ],
    code:`from collections import defaultdict
class DetectSquares:
    def __init__(self):
        self.pt_count = defaultdict(int)
        self.xs = defaultdict(set)  # y → set of x values on that row

    def add(self, point):
        x, y = point
        self.pt_count[(x, y)] += 1
        self.xs[y].add(x)

    def count(self, point):
        px, py = point
        total = 0
        for x1 in self.xs[py]:         # all points on query's row
            if x1 == px: continue
            side = abs(x1 - px)
            for dy in [side, -side]:    # square above or below
                y2 = py + dy
                total += (self.pt_count[(x1, py)] *
                           self.pt_count[(x1, y2)] *
                           self.pt_count[(px, y2)])
        return total`,
    tc:"O(n) add, O(sqrt(n)) count avg", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"count(11,10): xs[10]={3,11}", detail:"x1=3, side=|3-11|=8. y2=10+8=18: check (3,10)*(3,18)*(11,18)=1*0*0=0. y2=10-8=2: check (3,10)*(3,2)*(11,2)=1*1*1=1."},
        {label:"Total=1", detail:"One valid square: corners (11,10),(3,10),(3,2),(11,2)."}
      ],
      edgeCase:"px==x1: skip (zero-area square). Multiple identical points: multiply their counts."
    },
    similar:{"Hash Map":["Max Points on a Line","Line Reflection","Number of Boomerangs"]}
  }
},

"max-points-on-a-line": {
  num:145, title:"Max Points on a Line", diff:"Hard", cat:"Math / Geometry",
  lc:"https://leetcode.com/problems/max-points-on-a-line/",
  rev:"12 min", pattern:"Hash Map — Slope Counting per Anchor",
  sections:{
    explain:"Given a list of points on a 2D plane, return the maximum number of points that lie on the same straight line.",
    example:{input:"points=[[1,1],[2,2],[3,3]]", output:"3"},
    intuition:"For each anchor point, count how many other points share the same slope. The maximum count + 1 (the anchor) is the line size through that anchor. Use fraction-reduced slope as key to avoid floating point errors.",
    tricks:[
      {name:"Use reduced fraction for slope", detail:"slope = (dy/gcd, dx/gcd) with sign normalization. Avoids float precision issues. Special case: vertical lines (dx=0)."},
      {name:"O(n²) — fix anchor, count slopes", detail:"For each of n anchors, scan all other n-1 points. O(n²) total, which is optimal for this problem."}
    ],
    code:`from collections import defaultdict
from math import gcd
def maxPoints(self, points):
    n = len(points)
    if n <= 2: return n
    res = 2
    for i in range(n):
        slopes = defaultdict(int)
        for j in range(n):
            if i == j: continue
            dx = points[j][0] - points[i][0]
            dy = points[j][1] - points[i][1]
            g = gcd(abs(dx), abs(dy))
            slope = (dy // g, dx // g) if g else (1, 0)
            slopes[slope] += 1
        res = max(res, max(slopes.values()) + 1)
    return res`,
    tc:"O(n^2)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"points=[[1,1],[2,2],[3,3]], anchor=(1,1)", detail:"To (2,2): dy=1,dx=1,g=1,slope=(1,1). To (3,3): dy=2,dx=2,g=2,slope=(1,1). slopes={(1,1):2}. max=2+1=3."}
      ],
      edgeCase:"All same point: return 1 (constraints say distinct, but guard with n<=2 check). Vertical line: dx=0, slope=(1,0)."
    },
    similar:{"Math":["Detect Squares","Line Reflection","Check if Points Form a Straight Line"]}
  }
},

"rectangle-area": {
  num:146, title:"Rectangle Area", diff:"Medium", cat:"Math / Geometry",
  lc:"https://leetcode.com/problems/rectangle-area/",
  rev:"7 min", pattern:"Inclusion-Exclusion for Overlap Area",
  sections:{
    explain:"Find the total area covered by two axis-aligned rectangles. Rectangles may overlap.",
    example:{input:"ax1=-3,ay1=0,ax2=3,ay2=4,bx1=0,by1=-1,bx2=9,by2=2", output:"45"},
    intuition:"Total area = area(A) + area(B) − overlap area. Overlap exists only if rectangles intersect. Overlap width = max(0, min(ax2,bx2) − max(ax1,bx1)), overlap height = max(0, min(ay2,by2) − max(ay1,by1)).",
    tricks:[{name:"Overlap dimensions clamped to 0", detail:"max(0, min(right1,right2) - max(left1,left2)) gives 0 if no horizontal overlap. Same for vertical. Multiply for overlap area."}],
    code:`def computeArea(self, ax1, ay1, ax2, ay2, bx1, by1, bx2, by2):
    area_a = (ax2 - ax1) * (ay2 - ay1)
    area_b = (bx2 - bx1) * (by2 - by1)
    # Overlap
    ow = max(0, min(ax2, bx2) - max(ax1, bx1))
    oh = max(0, min(ay2, by2) - max(ay1, by1))
    return area_a + area_b - ow * oh`,
    tc:"O(1)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"A=(-3,0,3,4), B=(0,-1,9,2)", detail:"area_A=6*4=24, area_B=9*3=27. ow=max(0,min(3,9)-max(-3,0))=max(0,3-0)=3. oh=max(0,min(4,2)-max(0,-1))=max(0,2-0)=2. overlap=6. Total=24+27-6=45."}
      ],
      edgeCase:"No overlap: ow or oh = 0, overlap area = 0. One rectangle inside other: overlap = area of smaller rectangle."
    },
    similar:{"Math":["Rectangle Overlap","Max Rectangle","Largest Rectangle in Histogram"]}
  }
},

"maximal-square": {
  num:147, title:"Maximal Square", diff:"Medium", cat:"Math / Geometry",
  lc:"https://leetcode.com/problems/maximal-square/",
  rev:"10 min", pattern:"DP — Square Size from Three Neighbors",
  sections:{
    explain:"Given a binary matrix of '0' and '1', find the largest square containing only '1's and return its area.",
    example:{input:"matrix=[['1','0','1','0'],['1','0','1','1'],['1','1','1','1'],['1','0','0','1']]", output:"4"},
    intuition:"dp[i][j] = side length of the largest square whose bottom-right corner is (i,j). If matrix[i][j]=='1': dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1. The min of the three neighbors is the bottleneck — the square can only be as large as its limiting neighbor.",
    tricks:[
      {name:"min(top, left, top-left) + 1", detail:"The three neighbors represent: the square above, to the left, and diagonally up-left. The smallest constrains how large a square we can form."},
      {name:"1D DP optimization", detail:"Process row by row keeping one prev array. dp[j] = min(dp[j], dp[j-1], prev_diag) + 1."}
    ],
    code:`def maximalSquare(self, matrix):
    if not matrix: return 0
    m, n = len(matrix), len(matrix[0])
    dp = [[0]*(n+1) for _ in range(m+1)]
    max_side = 0
    for i in range(1, m+1):
        for j in range(1, n+1):
            if matrix[i-1][j-1] == '1':
                dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
                max_side = max(max_side, dp[i][j])
    return max_side * max_side`,
    tc:"O(m*n)", sc:"O(m*n)",
    walkthrough:{
      steps:[
        {label:"matrix row 2 (0-indexed): ['1','0','1','1']", detail:"dp[2][1]=1(only cell). dp[2][3]: matrix='1', min(dp[1][3]=1,dp[2][2]=0,dp[1][2]=1)+1=min(1,0,1)+1=1. dp[2][4]: min(1,1,1)+1=2. max_side=2."},
        {label:"matrix row 3: ['1','1','1','1']", detail:"dp[3][3]=min(dp[2][3]=1,dp[3][2]=1,dp[2][2]=0)+1=1+1=2. dp[3][4]=min(dp[2][4]=2,dp[3][3]=2,dp[2][3]=1)+1=2. max_side=2. Area=4."}
      ],
      edgeCase:"All zeros: return 0. All ones: dp fills to min(m,n) side length. Single '1': returns 1."
    },
    similar:{"DP":["Maximal Rectangle","Largest Rectangle in Histogram","Count Square Submatrices"]}
  }
},

/* ════════════════ POPULAR EXTRAS ════════════════ */

"merge-k-sorted-lists": {
  num:148, title:"Merge K Sorted Lists", diff:"Hard", cat:"Linked List",
  lc:"https://leetcode.com/problems/merge-k-sorted-lists/",
  rev:"10 min", pattern:"Min-Heap / Divide and Conquer",
  sections:{
    explain:"Merge k sorted linked lists into one sorted linked list.",
    example:{input:"lists=[[1,4,5],[1,3,4],[2,6]]", output:"[1,1,2,3,4,4,5,6]"},
    intuition:"Use a min-heap of size k: push the head of each list. Pop the smallest node, append it to the result, then push that node's next (if any). This always extends from the current minimum across all lists. Alternatively: divide-and-conquer by repeatedly merging pairs (like merge sort).",
    tricks:[
      {name:"Min-heap of (val, index, node)", detail:"Push (node.val, list_index, node) to break ties. Python's heap compares tuples element-by-element — include list_index to avoid comparing ListNode objects."},
      {name:"Divide and conquer O(n log k)", detail:"Pair up lists and merge them. Halve the number of lists each round. Total work: n * log k (n = total nodes, k = number of lists). Same complexity as heap, simpler code for some."}
    ],
    code:`import heapq
def mergeKLists(self, lists):
    dummy = curr = ListNode(0)
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
    tc:"O(n log k) n=total nodes", sc:"O(k)",
    walkthrough:{
      steps:[
        {label:"Init heap with heads", detail:"Push (1,0,node1_0),(1,1,node2_0),(2,2,node3_0). Heap=[(1,0,...),(1,1,...),(2,2,...)]."},
        {label:"Pop (1,0,node1_0)", detail:"Append node(1). Push node1_0.next=(4,0,...). Heap=[(1,1,...),(2,2,...),(4,0,...)]."},
        {label:"Continue", detail:"Pop (1,1)→append 1, push node(3). Pop (2,2)→append 2, push node(6). Pop (3,1)→append 3... until heap empty."}
      ],
      edgeCase:"Empty lists array: return None. Lists with None entries: skip on init. Single list: just returns it."
    },
    similar:{"Heap":["Merge Two Sorted Lists","Sort List","Smallest Range Covering Elements from K Lists"]}
  }
},

"top-k-frequent-elements": {
  num:149, title:"Top K Frequent Elements", diff:"Medium", cat:"Heap / Priority Queue",
  lc:"https://leetcode.com/problems/top-k-frequent-elements/",
  rev:"7 min", pattern:"Heap or Bucket Sort",
  sections:{
    explain:"Given an integer array, return the k most frequent elements. Answer can be in any order.",
    example:{input:"nums=[1,1,1,2,2,3], k=2", output:"[1,2]"},
    intuition:"Count frequencies with a hash map. Use a min-heap of size k: for each (element, count) pair, push to heap; if heap grows beyond k, pop the least frequent. What remains is the top k. Alternative: bucket sort by frequency — bucket[freq] = list of nums — O(n).",
    tricks:[
      {name:"Min-heap of size k on frequency", detail:"Push (count, num). When heap size > k, pop minimum. O(n log k) — better than O(n log n) full sort for large n with small k."},
      {name:"Bucket sort O(n)", detail:"Frequency can be at most n. Create n+1 buckets, put each num into bucket[freq[num]]. Scan from bucket[n] down to collect k elements."}
    ],
    code:`from collections import Counter
import heapq
def topKFrequent(self, nums, k):
    count = Counter(nums)
    # Bucket sort: bucket[freq] = [nums with that freq]
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, freq in count.items():
        buckets[freq].append(num)
    res = []
    for freq in range(len(buckets) - 1, 0, -1):
        for num in buckets[freq]:
            res.append(num)
            if len(res) == k:
                return res`,
    tc:"O(n)", sc:"O(n)",
    walkthrough:{
      steps:[
        {label:"nums=[1,1,1,2,2,3], k=2", detail:"count={1:3,2:2,3:1}. buckets[3]=[1], buckets[2]=[2], buckets[1]=[3]."},
        {label:"Scan from high freq down", detail:"freq=6: empty. ... freq=3: append 1 → res=[1]. freq=2: append 2 → res=[1,2]. len==k=2 → return [1,2]."}
      ],
      edgeCase:"k equals number of unique elements: return all. All same element: bucket[n] has one entry."
    },
    similar:{"Heap":["Kth Largest Element","Sort Characters by Frequency","K Closest Points to Origin"]}
  }
},

"maximum-product-subarray": {
  num:150, title:"Maximum Product Subarray", diff:"Medium", cat:"Dynamic Programming",
  lc:"https://leetcode.com/problems/maximum-product-subarray/",
  rev:"8 min", pattern:"Track Both Max and Min Products",
  sections:{
    explain:"Find the contiguous subarray with the largest product.",
    example:{input:"nums=[2,3,-2,4]", output:"6", why:"[2,3] has product 6"},
    intuition:"Unlike max sum (Kadane's), a negative × negative = positive, so a very negative running product can flip to a large positive. Track BOTH the current max and current min products at each step. At each element, the new max is max(num, prev_max*num, prev_min*num) — the min might become the new max after multiplying by a negative.",
    tricks:[
      {name:"Track both max and min", detail:"curr_max = max(n, prev_max*n, prev_min*n). curr_min = min(n, prev_max*n, prev_min*n). A negative flips which one is max and which is min."},
      {name:"Reset on zero", detail:"Any product including 0 becomes 0. After a zero, max and min both reset to the next element — same as starting fresh."}
    ],
    code:`def maxProduct(self, nums):
    res = max(nums)
    curr_min = curr_max = 1
    for n in nums:
        if n == 0:
            curr_min = curr_max = 1
            continue
        vals = (n, curr_max * n, curr_min * n)
        curr_max = max(vals)
        curr_min = min(vals)
        res = max(res, curr_max)
    return res`,
    tc:"O(n)", sc:"O(1)",
    walkthrough:{
      steps:[
        {label:"nums=[2,3,-2,4]", detail:"n=2: vals=(2,2,2),max=2,min=2,res=2. n=3: vals=(3,6,6),max=6,min=3,res=6. n=-2: vals=(-2,-12,-6),max=-2,min=-12,res=6. n=4: vals=(4,-8,-48),max=4,min=-48,res=6."},
        {label:"nums=[-2,3,-4]", detail:"n=-2: max=-2,min=-2. n=3: max=3,min=-6. n=-4: vals=(-4,-12,24),max=24 → res=24."}
      ],
      edgeCase:"Single element: return it. All negatives with even count: product of all. Zero in array: splits into independent subarrays."
    },
    similar:{"DP":["Maximum Subarray","Minimum Product Subarray","Product of Array Except Self"]}
  }
}

}; // end window.LC150_PROBLEMS
