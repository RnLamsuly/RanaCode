# LinK06 两数之和
[题目链接](http://xmuoj.com/contest/362/problem/LinK06)

## 思路
这题考察的是双指针，即使用两个索引变量，从两端向中间遍历的思路。

由于题目保证给定的序列严格单调递增且具有唯一解，我们可以使用如下思路求解：

1. 从序列两端取索引 `i=0, j=n-1`；
2. 若对应数的和大于目标，那么需要使和减小，故将 `j` 左移一位；
3. 若对应数的和小于目标，那么需要使和增大，故将 `i` 右移一位；
4. 若对应数的和等于目标，即求解成功。

相比暴力枚举，双指针将[时间复杂度](https://oi-wiki.org/basic/complexity/)由 $O(n^2)$ 降低至 $O(n)$。

---

## 注意
如何证明思路的合理性？

我们可以考虑索引过程中的某个数 $a_j$。若存在某个索引 $a_i$，使得：

$$ a_i + a_j < \textit{target},\; a_{i+1} + a_j > \textit{target} $$

由于数列严格单调，则可以得出对于任意的索引 `i`，我们都无法找到 $a_i + a_j = \textit{target}$，这个时候我们必须将索引 `j` 左移一位，否则无法找到解。

同理可得和小于目标的时候，需要将 `i` 右移一位。

上述仅为证明思路，并非严格证明。

---

## AC 代码
```cpp
#include <iostream>
const int MAXN=1e6;
int a[MAXN];
 
int main()
{
	int target,n;
	std::cin>>target>>n;
	for(int i=0;i<n;++i)
	{
		std::cin>>a[i];
	}
	int i=0,j=n-1; //定义双指针索引
	while(a[i]+a[j]!=target) //按照上面提到的思路移动索引
	{
		if(a[i]+a[j]<target)i++;
		if(a[i]+a[j]>target)j--;
	}
	std::cout<<i<<' '<<j; //题目保证有唯一解，故退出循环的时候一定对应所求的解
	return 0;
}
```