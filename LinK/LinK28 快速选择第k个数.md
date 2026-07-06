# LinK28 快速选择第k个数
[题目链接](http://xmuoj.com/contest/362/problem/LinK28)

**快速选择**是一种用于**在无序数组中查找第 k 小（或第 k 大）元素**的选择算法。  
它与[快速排序](https://oi-wiki.org/basic/quick-sort/)同源，但只递归处理单侧子数组，因此平均[时间复杂度](https://oi-wiki.org/basic/complexity/)优于排序后取值。

- 输入：无序数组 `nums`，整数 `k`（通常从 1 开始计数）
- 输出：数组中第 k 小的元素
- 特点：原地操作、期望 O(n) 时间、最坏 O(n²)（但可通过随机化避免）

---

## 核心思想

快速选择基于**分区**操作：

1. 从数组中选取一个基准值（pivot）。
2. 将数组分为两部分：
   - 左边 $\le$ pivot
   - 右边 $\ge$ pivot
3. 确定 pivot 在排序后的最终位置 `p`。
4. 若 `p == k-1`，则 pivot 就是答案。
5. 若 `p > k-1`，则只在左子数组中递归查找。
6. 若 `p < k-1`，则只在右子数组中递归查找。

> 与快排不同：快排递归两侧，快速选择只递归一侧。

---

## AC代码

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

const int N = 100010;
int q[N];

// 快速选择函数：返回区间 [l, r] 中第 k 小的数（k 从 0 开始）
int quick_select(int l, int r, int k) {
    // 如果区间只有一个数，直接返回
    if (l >= r) return q[l];
    
    // 1. 选取基准值（这里取中间位置的数，避免最坏情况）
    int pivot = q[(l + r) / 2];
    int i = l - 1, j = r + 1;
    
    // 2. 分区：左边 <= pivot，右边 >= pivot
    while (i < j) {
        do i++; while (q[i] < pivot);
        do j--; while (q[j] > pivot);
        if (i < j) swap(q[i], q[j]);
    }
    // 循环结束后，j 是左半部分的最后一个位置
    // 此时 [l, j] <= pivot，[j+1, r] >= pivot
    
    // 3. 判断第 k 小的数在哪个区间
    // 左半部分的长度为 j - l + 1
    int left_len = j - l + 1;
    
    if (k < left_len) {
        // 目标在左半部分
        return quick_select(l, j, k);
    } else {
        // 目标在右半部分（注意 k 要减去左半部分的长度）
        return quick_select(j + 1, r, k - left_len);
    }
}

int main() {
    int n, k;
    cin >> n >> k;
    
    for (int i = 0; i < n; i++) {
        cin >> q[i];
    }
    
    // 注意：k 从 1 开始，但 quick_select 中 k 从 0 开始
    int result = quick_select(0, n - 1, k - 1);
    cout << result << endl;
    
    return 0;
}
```