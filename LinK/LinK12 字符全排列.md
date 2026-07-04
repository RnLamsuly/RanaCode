# LinK12 字符全排列
[题目链接](http://xmuoj.com/contest/362/problem/LinK12)

## 思路

和排列数字的思路一样。我们使用数组实现数字到给定字符的映射，然后将排列的数字排列作为索引获取字母排列即可。

---

## 注意

由于题目要求给出的字符串按照字典序排序。按照上一题的思路，我们每一位的数字都是从 $1$ 开始枚举的，也就是说越小的数字越优先排列在前面。如果要求给定字符生成的排列按照字典序排列，我们要保证字母序更小的字母对应的索引更小，也就是需要将输入的字符按照字典序排序。

---

## AC 代码
```cpp
#include<bits/stdc++.h>
using std::string;
using std::cin;
using std::cout;
using std::endl;
int n,flag[15],get[15];
string s; //字符串本质是字符数组
inline void output()
{
	for(register int i=1;i<=n;i++)	printf("%c",s[get[i]-1]); 
    //直接使用上一题代码，数字是从1开始的，但是索引从0开始
    //所以数字需要减去1才是字符索引
	cout<<endl;
    return;	
} 
inline void dfs(int k)
{
	if(k==n)
	{
		output();
		return;
	}
	for(register int i=1;i<=n;i++)
	{
		if(flag[i])continue;
			
			flag[i]=1;
			get[k+1]=i;
			dfs(k+1);
			flag[i]=0;
	}
}
int main()
{
	cin>>s;
	n=s.length();
	sort(s.begin(),s.end()); //排序
	dfs(0);
	return 0;	
}
```