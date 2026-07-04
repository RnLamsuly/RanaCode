# LinK05 假币问题
[题目链接](http://xmuoj.com/contest/362/problem/LinK05)

## 思路
这是一道基础的语法题，常规思路有：
- 枚举假币，判断是否符合条件；
- 排除法，将每次称重符合条件的真币排除。
考虑到硬币数量固定为 $12$ 个，两种方法对于每组数据的复杂度都是 $O(1)$，效率仅有常数上的区别。因此两种方法应该均能在时间限制内完成运行。

枚举法较为容易，下面考虑的是排除法：

由于每次称重两边的硬币数量相等，且假币只有一枚，如果天平平衡，那么天平两边必定都是真币。

综合三次称重，我们会遇到两种情况：
1. 三次称重结果都是平衡的，这时假币在未称重的硬币里；
2. 三次称重结果出现了不平衡，这时假币在参与称重的硬币里。

我们分别假设假币更轻和更重的两种情况下，用一个数组来记录每个硬币的状态（$2$ 为未参与称重；$1$ 为参与称重；$0$ 为参与称重且确定为真），则上面提到的第一种情况对应的是**只有 $0$ 和 $2$ 两种状态**的情况（此时若状态为 $2$ 的硬币唯一，那么其一定是假币）；第二种情况对应的是**三种状态都有**的情况（此时若状态 $1$ 的硬币唯一，那么其一定是假币）。

---

## 注意
状态确认的优先级顺序为 $0 > 1 > 2$，比如状态为 $2$ 的硬币可能转化为 $1$，但状态为 $1$ 的硬币不可能转化为 $2$。这是因为：

1. 初始硬币均为未称重状态（$2$）；
2. 参与过任何一次称重的硬币将变为 $1$，不可能再变为 $2$；
3. 参与过平衡或天平倾斜时符合真币条件的一侧的硬币确认为 $0$，不可能再变为 $1$。

---

## AC 代码
```cpp
#include <iostream>
#include <string>
using std::string;
using std::cin;
using std::cout;
 
int coins[12];
string input[3][3];
 
int chrToInt(char c) //将硬币的字母编号转化为数字索引 
{
	return c-'A';
}
 
char intToChr(int n)//将硬币的数字索引转化为字母编号 
{
	return 'A'+n;
}
 
void initialize()//将硬币的状态初始化为未参与称重的状态 
{
	for(int i=0;i<12;++i)coins[i]=2;
}
 
int getResult()
{
	int ans=-1,cnt=0;
	for(int i=0;i<12;++i)if(coins[i]==1)ans=i, ++cnt; //这是有硬币为1的情况，假币为唯一的一个状态为1的硬币。如果有多个硬币为状态1那么将无法判断 
	if(cnt==1)return ans;
	if(cnt>1)return -1;
	ans=-1,cnt=0;
	for(int i=0;i<12;++i)if(coins[i]==2)ans=i, ++cnt;//这是没有硬币为1的情况，假币为唯一的一个状态为2的硬币。如果有多个硬币为状态2那么将无法判断 
	if(cnt==1)return ans;
	return -1;
}
 
void markTrue(string list)//将字符串表示的列表中的硬币标记为0
{
	for(int i=0;i<list.length();++i)coins[chrToInt(list[i])]=0;
}
 
void markFake(string list)//将字符串表示的列表中的硬币标记为1
{
	for(int i=0;i<list.length();++i)if(coins[chrToInt(list[i])])coins[chrToInt(list[i])]=1;//这里加入条件判断防止将优先级更高的状态0标记为状态1 
}
 
void markTrueOthers(string left, string right) { //不平衡时将其余未参与称重的硬币标记为真 
    bool in[12] = {false};
    for (int i = 0; i < left.length(); ++i)  in[chrToInt(left[i])] = true;
    for (int i = 0; i < right.length(); ++i) in[chrToInt(right[i])] = true;
    for (int i = 0; i < 12; ++i)
        if (!in[i]) coins[i] = 0;
}
 
//下面是分别假设假币偏轻和偏重的两次排除 
int ansForCase1()
{
	initialize();
	for(int i=0;i<3;++i)
	{
		if(input[i][0].length()!=input[i][1].length())continue;
		if(input[i][2]=="even")
		{
			markTrue(input[i][0]);
			markTrue(input[i][1]);
		}
		if(input[i][2]=="up")
		{
			markFake(input[i][1]);
			markTrue(input[i][0]);
			markTrueOthers(input[i][0], input[i][1]);
		}
		if(input[i][2]=="down")
		{
			markFake(input[i][0]);
			markTrue(input[i][1]);
			markTrueOthers(input[i][0], input[i][1]);
		}
	}
	return getResult();
}
 
int ansForCase2()
{
	initialize();
	bool flag=(input[0][2]=="even")&&(input[1][2]=="even")&&(input[2][2]=="even");
	for(int i=0;i<3;++i)
	{
		if(input[i][0].length()!=input[i][1].length())continue;
		if(input[i][2]=="even")
		{
			markTrue(input[i][0]);
			markTrue(input[i][1]);
		}
		if(input[i][2]=="up")
		{
			markFake(input[i][0]);
			markTrue(input[i][1]);
			if(!flag)markTrueOthers(input[i][0], input[i][1]);
		}
		if(input[i][2]=="down")
		{
			markFake(input[i][1]);
			markTrue(input[i][0]);
			if(!flag)markTrueOthers(input[i][0], input[i][1]);
		}
	}
	return getResult();
}
 
void solution()
{
	cin>>input[0][0]>>input[0][1]>>input[0][2];
	cin>>input[1][0]>>input[1][1]>>input[1][2];
	cin>>input[2][0]>>input[2][1]>>input[2][2];
	int a1=ansForCase1(),a2=ansForCase2();//两个假设中应当只有一个有解 
	if(a1<0 && a2>=0)
	{
		printf("%c is the counterfeit coin and it is heavy.\n",intToChr(a2)); 
		return;
	}
	if(a2<0 && a1>=0)
	{
		printf("%c is the counterfeit coin and it is light.\n",intToChr(a1));
		return;
	}
	printf("TestError");
	return;
}
 
int main()
{
	int n;
	cin>>n;
	while(n--)
	{
		solution();
	}
	return 0;
}
```
