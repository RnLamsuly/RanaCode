# LinK04 排序考试
[题目链接](http://xmuoj.com/contest/362/problem/LinK04)

## 思路

[快速排序](https://oi-wiki.org/basic/quick-sort/)是一种常用的排序方法，其平均[时间复杂度](https://oi-wiki.org/basic/complexity/)为 $O(n \log n)$。

快速排序采用分治思想，通过三个步骤完成：

1. 选择基准：从数组中选择一个元素作为基准（这一步时间复杂度为 $O(1)$）；
2. 分区：将数组重新排列，使得所有比基准小的元素在基准左边，所有比基准大的元素在基准右边（这一步时间复杂度为 $O(n)$）；
3. 递归排序：对基准左右两个子数组递归执行上述操作（这一步时间复杂度为 $O(\log n)$）。

参考代码如下：

```cpp
// 分区函数：将数组分成两部分，返回基准的最终位置
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[low];  // 选择第一个元素作为基准
    int i = low;           // i 指向小于基准的区域末尾
    
    for (int j = low + 1; j <= high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[low], arr[i]);  // 将基准放到正确位置
    return i;
}

// 快速排序主函数
void quickSort(vector<int>& arr, int low, int high) {
    if (low >= high) return;
    
    int pi = partition(arr, low, high);  // 分区
    quickSort(arr, low, pi - 1);          // 递归排序左半部分
    quickSort(arr, pi + 1, high);         // 递归排序右半部分
}

```

---

## 注意

C++ 的库 `<algorithm>` 中内置了快速排序函数 `sort`，给定排序区间首尾的指针以及比较函数（可选），即可进行快排。

这题似乎不允许行末的空格出现，故需要特殊处理。

---

## AC 代码
```cpp
#include <iostream>
#include <string.h>
#include <algorithm>
 
#define int long long
 
const int MAXN=1e6+5;
int a[MAXN];
 
bool cmp(int a,int b)
{
	return a<b;
}
 
signed main()
{
	int n,m;
	scanf("%lld",&n);
	while(n--)
	{
		scanf("%lld",&m);
		for(int i=0;i<m;++i)scanf("%lld",&a[i]);
		std::sort(a,a+m);
		printf("%lld",a[0]);
		for(int i=1;i<m;++i)printf(" %lld",a[i]);
		putchar('\n');
	}
	return 0;
}
```