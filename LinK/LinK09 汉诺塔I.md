# LinK09 汉诺塔I
[题目链接](http://xmuoj.com/contest/362/problem/LinK09)

## 思路
考虑把 $n$ 个盘从 $A$ 移动到 $C$ 的情况，我们可以划分成三个阶段：

1. 将上方共 $n - 1$ 个盘从 $A$ 移动到 $B$；
2. 将 $A$ 剩余的最大盘移动到 $C$；
3. 将剩余 $n - 1$ 个盘从 $B$ 移动到 $C$。
   
特别地，当 $n = 1$ 的时候可以直接移动。

将上述思路用递归实现即可。

---

## 处理细节

三个柱子可以编号为 $0, 1, 2$。已知起点柱 $a$ 和终点柱 $b$ 后，辅助柱 $c$ 可直接用 $3 - a - b$ 算出，无需写 `if-else` 分支判断。

---

## AC 代码
```cpp
#include <iostream>
using namespace std;
 
char tag[3]={'A','B','C'};
 
void claim(int a,int b) //根据起止的索引，声明一步移动。在 n=1 直接移动盘子时调用
{
	printf("%c->%c\n",tag[a],tag[b]);
}
 
void move(int a,int b,int n)
{
	int c=3-a-b; //三个柱子的索引分别为0, 1, 2, 故用3减去其中任意两个索引得到的就是剩下的柱子的索引
	if(n==1)
	{
		claim(a,b);
		return;
	}
	move(a,c,n-1);
	claim(a,b);
	move(c,b,n-1);
}
 
int main()
{
	int n;
	cin>>n;
	move(0,2,n);
	return 0;
}
```