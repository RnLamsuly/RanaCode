# LinK10 汉诺塔II
[题目链接](http://xmuoj.com/contest/362/problem/LinK10)

## 思路

本题与汉诺塔I相比，有两个区别：
1. 柱的名字不再是 $A, B, C$，而是给定的字符；
2. 需要输出移动盘的序号。

第一点可以通过数组存储柱子的字符标签便捷实现；
第二点可以通过移动单个盘时直接输出其对应编号实现。

---

## AC 代码
```cpp
#include <iostream>
using namespace std;
 
char tag[3];
 
void claim(int a,int b,int n)
{
	printf("%d:%c->%c\n",n,tag[a],tag[b]);
}
 
void move(int a,int b,int n)
{
	int c=3-a-b;
	if(n==1)
	{
		claim(a,b,n);
		return;
	}
	move(a,c,n-1);
	claim(a,b,n); //直接移动n盘，声明移动的时候加上n盘的编号
	move(c,b,n-1);
}
 
int main()
{
	int n;
	cin>>n>>tag[0]>>tag[1]>>tag[2]; //柱的字符标签
	move(0,2,n);
	return 0;
}
```