# LinK29 输出前k大的数
[题目链接](http://xmuoj.com/contest/362/problem/LinK29)

**Top-K 问题**：与 [LinK28](http://xmuoj.com/contest/362/problem/LinK28) 相似，Top-K 问题也是与[快速排序](https://oi-wiki.org/basic/quick-sort/)同源的问题。

## 核心思想

Top-K 问题基于**分区**操作（降序排列，左大右小）：

1. 从数组中选取一个基准值（pivot）。
2. 将数组分为两部分：
   - 左边 $\ge$ pivot（大数）
   - 右边 $\le$ pivot（小数）
3. 确定 pivot 在排序后的最终位置 `p`。
4. **情况 1**：若 `p == k-1`
   - 左侧（包括 pivot）正好有 k 个数
   - 它们就是前 k 大，对左侧排序后输出
   
5. **情况 2**：若 `p > k-1`
   - 左侧数量 > k，前 k 大全在左侧
   - 对左侧继续递归找 Top-K（范围缩小）

6. **情况 3**：若 `p < k-1`
   - 左侧数量 < k，左侧（包括 pivot）全都是前 k 大的一部分
   - **先把左侧排序后全部加入答案**
   - 然后从右侧继续找剩下的 `k - (p - l + 1)` 个

---

## AC代码
```cpp
#include <iostream>
#include <algorithm>
using namespace std;

const int N = 100010;
int q[N];

// 降序分区：左边 >= pivot，右边 <= pivot
int partition_desc(int l, int r) {
    int pivot = q[(l + r) / 2];
    int i = l - 1, j = r + 1;
    while (i < j) {
        do i++; while (q[i] > pivot);
        do j--; while (q[j] < pivot);
        if (i < j) swap(q[i], q[j]);
    }
    return j;
}

// 找前 k 大的数（降序排列，只排必要的部分）
void top_k(int l, int r, int k) {
    if (l >= r || k == 0) return;
    
    int p = partition_desc(l, r);
    int left_len = p - l + 1;
    
    if (left_len == k) {
        // 左侧正好 k 个，对左侧排序后输出
        sort(q + l, q + p + 1, greater<int>());
        return;
    } else if (left_len > k) {
        // 左侧超过 k 个，只递归左侧
        top_k(l, p, k);
    } else {
        // 左侧不足 k 个，左侧全部是答案的一部分
        sort(q + l, q + p + 1, greater<int>());  // 先排序左侧
        // 从右侧继续找剩下的
        top_k(p + 1, r, k - left_len);
    }
}

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> q[i];
    }
    
    int k;
    cin >> k;
    
    top_k(0, n - 1, k);
    
    // 输出前 k 个（已经有序）
    for (int i = 0; i < k; i++) {
        cout << q[i] << endl;
    }
    
    return 0;
}
```