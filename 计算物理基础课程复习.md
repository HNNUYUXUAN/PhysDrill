# 计算物理基础课程复习

> 根据原始 DOCX 整理，保留原文结构、题目顺序、Mathematica 程序及计算过程。数学表达式使用 LaTeX，程序使用 Mathematica 代码块。原稿中少数代码存在拼写或旧版软件包语法问题；以下仅规范明确可辨认的内容。

## 一、填空题：给出下列符号操作的程序

1. 函数 $\sin x$：`Sin[x]`
2. 函数 $\cos x$：`Cos[x]`
3. 函数 $\tan x$：`Tan[x]`
4. 函数 $\cot x$：`Cot[x]`
5. 函数 $\sec x$：`Sec[x]`
6. 函数 $\arctan x$：`ArcTan[x]`
7. 函数 $e^x$：`Exp[x]`
8. 函数 $\ln x$：`Log[x]`
9. 函数 $\log_x y$：`Log[x, y]`
10. 函数 $\sqrt{x}$：`Sqrt[x]`
11. 复数 $x$ 的共轭：`Conjugate[x]`
12. 组合数 $\binom{n}{k}$：`Binomial[n, k]`
13. 复数 $x$ 的幅角：`Arg[x]`
14. 求和 $\displaystyle\sum_{i=1}^{10}i$：`Sum[i, {i, 1, 10}]`
15. 化简 $\displaystyle\frac{x^2-1}{x-1}$：`Simplify[(x^2-1)/(x-1)]`
16. 分解因式（原题表达式）$\displaystyle\frac{x-3}{x-1}$：`Factor[(x-3)/(x-1)]`
17. 展开三角函数 $\cos(2x)$：`TrigExpand[Cos[2x]]`
18. 将 $\sin x$ 展开成指数函数：`TrigToExp[Sin[x]]`
19. 将 $e^{ix}$ 展开为三角函数：`ExpToTrig[Exp[I x]]`
20. 实数 $2x$ 的绝对值：`Abs[2x]`
21. 找出 $(x,y,z)$ 中的最大值：`Max[x, y, z]`
22. 找出 $(x,y,z)$ 中的最小值：`Min[x, y, z]`
23. 求复数 $a+ib$ 的实部：`Re[a+ib]`
24. 求复数 $a+ib$ 的虚部：`Im[a+ib]`
25. 化简 $\displaystyle\frac{x^2-1}{x+1}$：`Simplify[(x^2-1)/(x+1)]`
26. 展开 $(x-1)^2$：`Expand[(x-1)^2]`
27. 对 $x^2-1$ 分解因式：`Factor[x^2-1]`

## 二、求解题

### 1. 求方程 $ax+b=0$

```mathematica
Solve[a x + b == 0, x]
```

### 2. 消除方程组中的变量 $z$

$$
\begin{cases}
ax+by-z=0,\
cx+dz-10=0.
\end{cases}
$$

```mathematica
Eliminate[{a x + b y - z == 0, c x + d z - 10 == 0}, z]
```

### 3. 求解不等式 $5x+6\geq 0$

```mathematica
Reduce[5 x + 6 >= 0]
```

### 4. 求 $\displaystyle\frac{\sin 2x}{\sin 5x}$ 在 $x\to0$ 时的极限

```mathematica
Limit[Sin[2 x]/Sin[5 x], x -> 0]
```

### 5. 求 $f=ax+bx^2+c$ 关于 $x$ 的偏微分

```mathematica
D[a x + b x^2 + c, x]
```

### 6. 求 $f=ax+bx^2+cy$ 关于 $x$ 的全微分

```mathematica
Dt[a x + b x^2 + c y, x]
```

### 7. 求 $f=2x+3x^2+4$ 关于 $x$ 的不定积分

```mathematica
Integrate[2 x + 3 x^2 + 4, x]
```

### 8. 求 $f=2x+3x^2+4$ 在 $1\leq x\leq2$ 的定积分

```mathematica
Integrate[2 x + 3 x^2 + 4, {x, 1, 2}]
```

### 9. 求无穷级数

$$
\sum_{k=1}^{\infty}\frac{1}{k^2}
$$

```mathematica
Sum[1/k^2, {k, 1, Infinity}]
```

### 10. 求连乘

$$
\prod_{i=1}^{5}(2i^2+4)
$$

```mathematica
Product[2 i^2 + 4, {i, 1, 5}]
```

### 11. 求 $\arcsin x$ 在 $x_0=1$ 处展开到第 9 项的幂级数

```mathematica
Series[ArcSin[x], {x, 1, 9}]
```

### 12. 求微分方程及其条件

$$
y''-y=1,\qquad y'(0)=y'(1),\qquad y(0)=1+y(1).
$$

```mathematica
DSolve[
  {y''[x] - y[x] == 1, y'[0] == y'[1], y[0] == 1 + y[1]},
  y[x], x
]
```

### 13. 求函数的最大值

$$
f(x)=1-(x-2)^{2/3}
$$

```mathematica
Maximize[1 - (x - 2)^(2/3), x]
```

### 14. 求函数在给定区间内的最小值

$$
f(x)=1-(x-2)^{2/3},\qquad 1\leq x\leq3.
$$

```mathematica
Minimize[{1 - (x - 2)^(2/3), 1 <= x <= 3}, x]
```

### 15. 求两个矢量的点积

$$
\mathbf a=(1,2,3),\qquad \mathbf b=(2,4,5).
$$

```mathematica
a = {1, 2, 3};
b = {2, 4, 5};
Dot[a, b]
```

### 16. 求两个矢量的叉积

$$
\mathbf a=(1,2,3),\qquad \mathbf b=(2,4,5).
$$

```mathematica
a = {1, 2, 3};
b = {2, 4, 5};
Cross[a, b]
```

### 17. 求矩阵 $a$ 的逆矩阵

$$
a=\begin{pmatrix}1&9\\2&3\end{pmatrix}.
$$

```mathematica
a = {{1, 9}, {2, 3}};
Inverse[a]
```

### 18. 求矩阵 $b$ 的行列式

$$
b=\begin{pmatrix}3&5\\2&3\end{pmatrix}.
$$

```mathematica
b = {{3, 5}, {2, 3}};
Det[b]
```

## 三、绘图题

### 1. 绘制函数图形

$$
y=\sin\left(2+\cos(x+1)\right),\qquad -10\leq x\leq10.
$$

```mathematica
Plot[Sin[2 + Cos[x + 1]], {x, -10, 10}]
```

### 2. 绘制参数方程图形

$$
x=\cos^3t,\qquad y=\sin^3t,\qquad 0\leq t\leq2\pi.
$$

```mathematica
ParametricPlot[{Cos[t]^3, Sin[t]^3}, {t, 0, 2 Pi}]
```

### 3. 绘制标量函数的等值线图

$$
\varphi=x^2+y^2,\qquad 0\leq x,y\leq2\pi.
$$

```mathematica
ContourPlot[x^2 + y^2, {x, 0, 2 Pi}, {y, 0, 2 Pi}]
```

### 4. 绘制标量函数的密度图

$$
\varphi=x^2+y^2,\qquad 0\leq x,y\leq2\pi.
$$

```mathematica
DensityPlot[x^2 + y^2, {x, 0, 2 Pi}, {y, 0, 2 Pi}]
```

### 5. 绘制极坐标方程图形

$$
r(t)=\sin t+1,\qquad 0\leq t\leq2\pi.
$$

```mathematica
<<Graphics`Graphics`
PolarPlot[Sin[t] + 1, {t, 0, 2 Pi}]
```

### 6. 绘制隐函数图形

$$
(x^2+y^2)^2=x^2-y^2,\qquad 0\leq x\leq2\pi.
$$

```mathematica
<<Graphics`ImplicitPlot`
ImplicitPlot[(x^2 + y^2)^2 == x^2 - y^2, {x, 0, 2 Pi}]
```

### 7. 绘制三维函数图形

$$
z=x^2+y^2,\qquad 0\leq x,y\leq2\pi.
$$

```mathematica
Plot3D[x^2 + y^2, {x, 0, 2 Pi}, {y, 0, 2 Pi}]
```

### 8. 绘制三维参数方程图形

$$
x=\cos^3t,\quad y=\sin^3t,\quad z=t,\quad 0\leq t\leq2\pi.
$$

```mathematica
ParametricPlot3D[{Cos[t]^3, Sin[t]^3, t}, {t, 0, 2 Pi}]
```

### 9. 绘制柱坐标函数图形

$$
z=r+\sin^2\theta,\qquad 0\leq r\leq1,\quad0\leq\theta\leq2\pi.
$$

```mathematica
<<Graphics`ParametricPlot3D`
CylindricalPlot3D[r + Sin[t]^2, {r, 0, 1}, {t, 0, 2 Pi}]
```

### 10. 绘制球坐标函数图形

原题给出的函数和范围为
$$
r=\sin\varphi+\cos^2\theta,\qquad
0\leq\varphi\leq\pi,\quad0\leq\theta\leq2\pi.
$$

```mathematica
<<Graphics`ParametricPlot3D`
SphericalPlot3D[Sin[r] + Cos[t]^2, {r, 0, Pi}, {t, 0, 2 Pi}]
```

### 11. 绘制二维矢量场

$$
\mathbf f(x,y)=\cos x\,\mathbf i+\sin y\,\mathbf j,
\qquad 0\leq x,y\leq\pi.
$$

```mathematica
<<Graphics`PlotField`
PlotVectorField[{Cos[x], Sin[y]}, {x, 0, Pi}, {y, 0, Pi}]
```

### 12. 绘制三维矢量场

$$
\mathbf f(x,y,z)=\cos x\,\mathbf i+\sin y\,\mathbf j+z\,\mathbf k,
\qquad 0\leq x,y,z\leq\pi.
$$

```mathematica
<<Graphics`PlotField3D`
PlotVectorField3D[
  {Cos[x], Sin[y], z},
  {x, 0, Pi}, {y, 0, Pi}, {z, 0, Pi}
]
```

### 13. 绘制标量函数的梯度场

$$
f(x,y)=x^2+y^2,\qquad -3\leq x,y\leq3.
$$

```mathematica
PlotGradientField[x^2 + y^2, {x, -3, 3}, {y, -3, 3}]
```

### 14. 绘制二维不等式图形

$$
x^2+y^2\leq2,\qquad -3\leq x,y\leq3.
$$

```mathematica
<<Graphics`InequalityGraphics`
InequalityPlot[x^2 + y^2 <= 2, {x, -3, 3}, {y, -3, 3}]
```

### 15. 绘制三维不等式图形

$$
x^2+y^2+2xz\leq2,\qquad -3\leq x,y,z\leq3.
$$

```mathematica
<<Graphics`InequalityGraphics`
InequalityPlot3D[
  x^2 + y^2 + 2 x z <= 2,
  {x, -3, 3}, {y, -3, 3}, {z, -3, 3}
]
```

## 四、计算题，并给出相应的求解程序

### 1. 质点沿 $x$ 轴做直线运动

运动方程为
$$
x(t)=t^3+2t+4.
$$

求 $t=2\,\mathrm{s}$ 时的速度和加速度。

**解：**

速度为
$$
v(t)=\frac{\mathrm dx}{\mathrm dt}=3t^2+2.
$$

加速度为
$$
a(t)=\frac{\mathrm dv}{\mathrm dt}=6t.
$$

当 $t=2\,\mathrm{s}$ 时，
$$
v(2)=3\times2^2+2=14,\qquad a(2)=6\times2=12.
$$

**Mathematica 程序及原稿输出：**

```mathematica
In[1]:= x = t^3 + 2 t + 4
Out[1]= t^3 + 2 t + 4

In[2]:= v = D[x, t]
Out[2]= 3 t^2 + 2

In[3]:= a = D[v, t]
Out[3]= 6 t

In[4]:= t = 2;

In[5]:= v2 = v
Out[5]= 14

In[6]:= a2 = a
Out[6]= 12
```

### 2. 圆形闭合导线中的感应电动势

一个圆形闭合导线放置在 $XOY$ 平面内，磁场沿 $Z$ 轴方向：
$$
\mathbf B=(1+\sqrt t)\,\mathbf k.
$$

圆形线圈半径随时间变化：
$$
r=t+t^2.
$$

求第 $2\,\mathrm{s}$ 时的感应电动势。

**解：**

由
$$
r=t+t^2
$$
可得
$$
\frac{\mathrm dr}{\mathrm dt}=1+2t.
$$

圆形线圈的环形面积元为
$$
\mathrm dS=2\pi r\,\mathrm dr
=2\pi(t+t^2)(1+2t)\,\mathrm dt.
$$

磁通量元为
$$
\mathrm d\Psi=\mathbf B\cdot\mathrm d\mathbf S
=2\pi(1+\sqrt t)(t+t^2)(1+2t)\,\mathrm dt.
$$

磁通量为
$$
\begin{aligned}
\Psi
&=\int \mathrm d\Psi\
&=2\pi\left(
\frac{t^2}{2}
+\frac{2t^{5/2}}{5}
+t^3
+\frac{6t^{7/2}}{7}
+\frac{t^4}{2}
+\frac{4t^{9/2}}{9}
\right).
\end{aligned}
$$

感应电动势为
$$
\begin{aligned}
\varepsilon
&=-\frac{\mathrm d\Psi}{\mathrm dt}\
&=-2\pi\left(
t+t^{3/2}+3t^2+3t^{5/2}+2t^3+2t^{7/2}
\right).
\end{aligned}
$$

当 $t=2\,\mathrm{s}$ 时，
$$
\varepsilon
=\left.-\frac{\mathrm d\Psi}{\mathrm dt}\right|_{t=2}
=-60(1+\sqrt2)\pi.
$$

**Mathematica 计算程序及原稿输出：**

```mathematica
In[1]:= r = t + t^2
Out[1]= t + t^2

In[2]:= dr = D[r, t]
Out[2]= 1 + 2 t

In[3]:= ds = {0, 0, r 2 Pi dr}
Out[3]= {0, 0, 2 Pi (1 + 2 t) (t + t^2)}

In[4]:= b = {0, 0, 1 + Sqrt[t]}
Out[4]= {0, 0, 1 + Sqrt[t]}

In[5]:= dPsi = Dot[b, ds]
Out[5]= 2 Pi (1 + Sqrt[t]) (1 + 2 t) (t + t^2)

In[6]:= Psi = Integrate[dPsi, t]
Out[6]= 2 Pi (t^2/2 + (2 t^(5/2))/5 + t^3
          + (6 t^(7/2))/7 + t^4/2 + (4 t^(9/2))/9)

In[7]:= v = -D[Psi, t]
Out[7]= -2 Pi (t + t^(3/2) + 3 t^2 + 3 t^(5/2)
          + 2 t^3 + 2 t^(7/2))

In[10]:= t = 2; v // Simplify
Out[10]= -60 (1 + Sqrt[2]) Pi
```

## 原稿核对说明

1. 原稿填空题第 15 题写作 `Simplfy`，属于拼写错误；正文采用可执行的 `Simplify`。
2. 原稿求解题第 10 题的连乘程序中，求积变量与迭代变量不一致；按题目求连乘的数学表达式统一为 `i`。
3. 原稿矩阵程序的花括号存在排版缺失；根据第 3 页矩阵图像恢复为 $a={{1,9},{2,3}}$ 和 $b={{3,5},{2,3}}$。
4. 原稿第 3、4 页使用 `Graphics`` 下的若干旧式绘图软件包命令。这些命令按原稿保留，不保证在当前 Mathematica 版本中无需调整即可运行。
5. 原稿第 6 页感应电动势计算的符号在文字识别中有缺损；结合页面公式图像，统一记为磁通量 $\Psi$、感应电动势 $\varepsilon$。原稿最后结果为 $-60(1+\sqrt2)\pi$。
