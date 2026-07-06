# LinK25 拨钟问题
[题目链接](http://xmuoj.com/contest/362/problem/LinK)

## 思路

每个钟有 $4$ 种操作方式，即顺时针旋转 $0$ 到 $3$ 次。

由于只有 $9$ 个种，我们可以利用枚举法在规定时间内完成求解。

这里我们依旧使用状态掩码进行枚举以简化代码。由于每个钟有 $4$ 种情况，我们应使用 $4$ 进制掩码。枚举范围为 $0 \sim 4^9 - 1$ ，即 $0 \sim 262144$ 。

---

## 注意

这里我们能简单枚举每个灯操作的次数，是因为我们对不同种的操作是**可以线性叠加的**。

---

## AC代码
```cpp
#include <iostream>
#include <algorithm>
using std::min; 
 
int b[9],a[9];
int MAXN=262144;
 
void execute(int x)
{
	switch(x)
	{
		case 0: a[0]++;a[1]++;a[3]++;a[4]++;break;
		case 1: a[0]++;a[1]++;a[2]++;break;
		case 2: a[1]++;a[2]++;a[4]++;a[5]++;break;
		case 3: a[0]++;a[3]++;a[6]++;break;
		case 4: a[1]++;a[3]++;a[4]++;a[5]++;a[7]++;break;
		case 5: a[2]++;a[5]++;a[8]++;break;
		case 6: a[3]++;a[4]++;a[6]++;a[7]++;break;
		case 7: a[6]++;a[7]++;a[8]++;break;
		case 8: a[4]++;a[5]++;a[7]++;a[8]++;break;
	}
}
 
int count(int x)
{
	int ret=0;
	while(x)
	{
		ret+=x&3;
		x>>=2;
	}
	return ret;
}
 
void output(int x)
{
	for(int i=0;i<9;++i)
	{
		for(int j=0;j<(x&3);++j)
			printf("%d ",i+1);
		x>>=2;
	}
}
 
void copy()
{
	for(int i=0;i<9;++i)a[i]=b[i];
}
 
bool check(int x)
{
	copy();
	for(int i=0;i<9;++i)
	{
		for(int j=0;j<(x&3);++j)
			execute(i);
		x>>=2;
	}
	for(int i=0;i<9;++i)if(a[i]%4)return 0;
	return 1;
}
 
int main()
{
	int ans=40,id=-1;
	for(int i=0;i<9;++i)scanf("%d",&b[i]);
	for(int i=0;i<MAXN;++i)
	{
		if(check(i) && count(i)<ans)
		{
			ans=count(i);
			id=i;
		}
	}
	output(id);
	return 0;
}
```

---


**枚举法**处理这题已经足够，但这里提供一种时间复杂度更低的解法，供参考。

## 拓展：高斯消元

**高斯消元**，是一种求解增广矩阵对应线性方程组的方法。先通过初等变化将增广矩阵变为行阶梯形矩阵，然后从下往上求解。

如果我们能依题意写出解的一个线性方程组，我们便可以尝试用高斯消元来求解。这大大减少了时间复杂度。

### 思路


我们用未知数 $x_1 \sim x_9$ 表示转动时钟 $1 \sim 9$ 的次数（取值 $0 \sim 3$）。由于操作可以线性叠加，我们可以列出下面的同余方程组：

$$
\begin{cases}
x_1 + x_2 + x_4 \equiv -A \pmod{4} & \text{(钟 A)}\\[4pt]
x_1 + x_2 + x_3 + x_5 \equiv -B \pmod{4} & \text{(钟 B)}\\[4pt]
x_2 + x_3 + x_6 \equiv -C \pmod{4} & \text{(钟 C)}\\[4pt]
x_1 + x_4 + x_5 + x_7 \equiv -D \pmod{4} & \text{(钟 D)}\\[4pt]
x_1 + x_3 + x_5 + x_7 + x_9 \equiv -E \pmod{4} & \text{(钟 E)}\\[4pt]
x_3 + x_5 + x_6 + x_9 \equiv -F \pmod{4} & \text{(钟 F)}\\[4pt]
x_4 + x_7 + x_8 \equiv -G \pmod{4} & \text{(钟 G)}\\[4pt]
x_5 + x_7 + x_8 + x_9 \equiv -H \pmod{4} & \text{(钟 H)}\\[4pt]
x_6 + x_8 + x_9 \equiv -I \pmod{4} & \text{(钟 I)}
\end{cases}
$$

其中 $A \sim I$ 为初始时各个钟相对于 $0\degree$ 的旋转次数。

将上面的方程组写成**增广矩阵**形式：

$$[M \mid \mathbf{b}] = 
\left[\begin{array}{ccccccccc|c}
1 & 1 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & -A \\
1 & 1 & 1 & 0 & 1 & 0 & 0 & 0 & 0 & -B \\
0 & 1 & 1 & 0 & 0 & 1 & 0 & 0 & 0 & -C \\
1 & 0 & 0 & 1 & 1 & 0 & 1 & 0 & 0 & -D \\
1 & 0 & 1 & 0 & 1 & 0 & 1 & 0 & 1 & -E \\
0 & 0 & 1 & 0 & 1 & 1 & 0 & 0 & 1 & -F \\
0 & 0 & 0 & 1 & 0 & 0 & 1 & 1 & 0 & -G \\
0 & 0 & 0 & 0 & 1 & 0 & 1 & 1 & 1 & -H \\
0 & 0 & 0 & 0 & 0 & 1 & 0 & 1 & 1 & -I
\end{array}\right]
$$

求解 $M \cdot \mathbf{x} \equiv \mathbf{b} \pmod 4$ 即是对上面的矩阵高斯消元的过程。

注：由于本题的 $M$ 是已经确定的，所以我们也可以手动计算 $M ^ {-1}$ 然后直接求解 $\mathbf{x} \equiv M ^ {-1} \mathbf{b} \pmod 4$ 。

### 处理细节

由于我们求解的是同余方程，要保证运算封闭性，即所有结果都在 $\{0,1,2,3\}$ 中，我们消元时应选择使用**模逆元**而非乘法逆元。由于在模 $4$ 运算中， $2$ 没有逆元，无法归 $1$ ，所以我们应该选择 $1$ 或 $3$ 作为消元的主元。

### 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int MOD = 4;

int A[9][10]; // 增广矩阵，9行10列（9个未知数+1个常数）

// 模4逆元（只有1和3有逆元，2没有逆元）
int inv(int x) {
    if (x == 1) return 1;
    if (x == 3) return 3; // 3*3=9≡1 (mod 4)
    return -1; // 2不可逆，需要交换行
}

int gauss() {
    int row = 0, col = 0;
    for (; col < 9 && row < 9; col++) {
        // 选主元（找非零且最好为1或3）
        int pivot = row;
        for (int i = row; i < 9; i++) {
            if (A[i][col] == 1 || A[i][col] == 3) { pivot = i; break; }
        }
        if (A[pivot][col] == 0) continue;
        swap(A[row], A[pivot]);
        
        // 主元归一化（乘以逆元）
        int inv_p = inv(A[row][col]);
        for (int j = col; j <= 9; j++) 
            A[row][j] = (A[row][j] * inv_p) % MOD;
        
        // 消去下方所有行
        for (int i = 0; i < 9; i++) {
            if (i != row && A[i][col] != 0) {
                int factor = A[i][col];
                for (int j = col; j <= 9; j++) {
                    A[i][j] = (A[i][j] - factor * A[row][j]) % MOD;
                    if (A[i][j] < 0) A[i][j] += MOD;
                }
            }
        }
        row++;
    }
    // 检查无解（理论上拨钟问题一定有解）
    for (int i = row; i < 9; i++) 
        if (A[i][9] != 0) return -1;
    
    return 1; // 有解
}

int main() {
    // 初始化系数矩阵（9行9列）
    int coeff[9][9] = {
        {1,1,0,1,0,0,0,0,0}, // A
        {1,1,1,0,1,0,0,0,0}, // B
        {0,1,1,0,0,1,0,0,0}, // C
        {1,0,0,1,1,0,1,0,0}, // D
        {1,0,1,0,1,0,1,0,1}, // E
        {0,0,1,0,1,1,0,0,1}, // F
        {0,0,0,1,0,0,1,1,0}, // G
        {0,0,0,0,1,0,1,1,1}, // H
        {0,0,0,0,0,1,0,1,1}  // I
    };
    
    int init[9];
    for (int i = 0; i < 9; i++) {
        cin >> init[i];
        // 构建增广矩阵：b[i] = -init[i] (mod 4)
        for (int j = 0; j < 9; j++) 
            A[i][j] = coeff[i][j];
        A[i][9] = (4 - init[i]) % 4;
    }
    
    gauss();
    
    // 输出解（按顺序输出次数>0的移动编号）
    for (int i = 0; i < 9; i++) {
        while (A[i][9] > 0) { // A[i][9]存储的是x_i的解
            cout << i+1 << " ";
            A[i][9]--;
        }
    }
    return 0;
}
```