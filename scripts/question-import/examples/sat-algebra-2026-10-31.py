"""Batch builder for questionbank-export-2026-10-31.pdf (30 SAT Algebra questions, saved 2026-11-01).

Worked example of the transcription style — copy this file to imports/<batch>/build.py for a new batch.
usage: python3 build.py <out.json>
"""
import sys
from pathlib import Path

# Works from scripts/question-import/examples/ and from imports/<batch>/
ROOT = next(p for p in Path(__file__).resolve().parents if (p / 'scripts/question-import/qbuild.py').exists())
sys.path.insert(0, str(ROOT / 'scripts/question-import'))
from qbuild import Batch, figure, table  # noqa: E402

b = Batch('questionbank-export-2026-10-31.pdf')

L1 = 'Linear equations in one variable'
L2 = 'Linear equations in two variables'
LF = 'Linear functions'
SY = 'Systems of two linear equations in two variables'
IN = 'Linear inequalities in one or two variables'

# 1 ─────────────────────────────────────────────
b.q('ac472881', 1, 'HARD', L1, r'''
\[\frac{12x+28}{4}-\frac{s}{13}=r(x-8)\]

In the given equation, \(s\) and \(r\) are constants, and \(s>0\). If the equation has infinitely many solutions, what is the value of \(s\)?
''', r'''
The correct answer is \(403\). For a linear equation in one variable to have infinitely many solutions, the coefficients of the variable must be equal on both sides of the equation and the constant terms must also be equal on both sides of the equation. The given equation can be rewritten as \(\frac{4(3x+7)}{4}-\frac{s}{13}=r(x-8)\), or \(3x+7-\frac{s}{13}=r(x-8)\). Applying the distributive property to the right-hand side of this equation yields \(3x+7-\frac{s}{13}=rx-8r\). For this equation to have infinitely many solutions, the coefficients of \(x\) must be equal, so it follows that \(3=r\). Additionally, the constant terms must be equal, which means \(7-\frac{s}{13}=-8r\). Substituting \(3\) for \(r\) in this equation yields \(7-\frac{s}{13}=-8(3)\), or \(7-\frac{s}{13}=-24\). Adding \(\frac{s}{13}\) to both sides of this equation yields \(7=-24+\frac{s}{13}\). Adding \(24\) to both sides of this equation yields \(31=\frac{s}{13}\). Multiplying both sides of this equation by \(13\) yields \(403=s\). Therefore, if the equation has infinitely many solutions, the value of \(s\) is \(403\).
''', answers=['403'], pdf='403')

# 2 ─────────────────────────────────────────────
b.q('3f5a3602', [2, 3], 'HARD', SY,
  figure('fig-p2.png', 'Two lines in the xy-plane intersecting at (8, 0)', 345, 337) + r'''

What system of linear equations is represented by the lines shown?
''', r'''
Choice D is correct. A line in the \(xy\)-plane that passes through the points \((x_1,y_1)\) and \((x_2,y_2)\) has slope \(m\), where \(m=\frac{y_2-y_1}{x_2-x_1}\), and can be defined by an equation of the form \(y-y_1=m(x-x_1)\). One of the lines shown in the graph passes through the points \((8,0)\) and \((3,4)\). Substituting \(8\) for \(x_1\), \(0\) for \(y_1\), \(3\) for \(x_2\), and \(4\) for \(y_2\) in the equation \(m=\frac{y_2-y_1}{x_2-x_1}\) yields \(m=\frac{4-0}{3-8}\), or \(m=-\frac{4}{5}\). Substituting \(-\frac{4}{5}\) for \(m\), \(8\) for \(x_1\), and \(0\) for \(y_1\) in the equation \(y-y_1=m(x-x_1)\) yields \(y-0=-\frac{4}{5}(x-8)\), which is equivalent to \(y=-\frac{4}{5}x+\frac{32}{5}\). Adding \(\frac{4}{5}x\) to both sides of this equation yields \(\frac{4}{5}x+y=\frac{32}{5}\). Multiplying both sides of this equation by \(-10\) yields \(-8x-10y=-64\). Therefore, an equation of this line is \(-8x-10y=-64\). Similarly, the other line shown in the graph passes through the points \((8,0)\) and \((3,2)\). Substituting \(8\) for \(x_1\), \(0\) for \(y_1\), \(3\) for \(x_2\), and \(2\) for \(y_2\) in the equation \(m=\frac{y_2-y_1}{x_2-x_1}\) yields \(m=\frac{2-0}{3-8}\), or \(m=-\frac{2}{5}\). Substituting \(-\frac{2}{5}\) for \(m\), \(8\) for \(x_1\), and \(0\) for \(y_1\) in the equation \(y-y_1=m(x-x_1)\) yields \(y-0=-\frac{2}{5}(x-8)\), which is equivalent to \(y=-\frac{2}{5}x+\frac{16}{5}\). Adding \(\frac{2}{5}x\) to both sides of this equation yields \(\frac{2}{5}x+y=\frac{16}{5}\). Multiplying both sides of this equation by \(10\) yields \(4x+10y=32\). Therefore, an equation of this line is \(4x+10y=32\). So, the system of linear equations represented by the lines shown is \(4x+10y=32\) and \(-8x-10y=-64\).

Choice A is incorrect and may result from conceptual or calculation errors.

Choice B is incorrect and may result from conceptual or calculation errors.

Choice C is incorrect and may result from conceptual or calculation errors.
''', options=[
    r'''\(8x+4y=32\)

\(-10x-4y=-64\)''',
    r'''\(8x-4y=32\)

\(-10x+4y=-64\)''',
    r'''\(4x-10y=32\)

\(-8x+10y=-64\)''',
    r'''\(4x+10y=32\)

\(-8x-10y=-64\)''',
], correct='D', figures=['fig-p2.png'])

# 3 ─────────────────────────────────────────────
b.q('3d1070c9', 4, 'EASY', LF, r'''
The function \(f\) is defined by \(f(x)=25x+30\). What is the value of \(f(x)\) when \(x=2\)?
''', r'''
Choice C is correct. It’s given that the function \(f\) is defined by \(f(x)=25x+30\). Substituting \(2\) for \(x\) in this equation yields \(f(2)=25(2)+30\), which is equivalent to \(f(2)=50+30\), or \(f(2)=80\). Therefore, the value of \(f(x)\) is \(80\) when \(x=2\).

Choice A is incorrect. This is the value of \(25(2)\), not \(25(2)+30\).

Choice B is incorrect. This is the value of \(25+2+30\), not \(25(2)+30\).

Choice D is incorrect. This is the value of \((25+30)(2)\), not \(25(2)+30\).
''', options=[r'\(50\)', r'\(57\)', r'\(80\)', r'\(110\)'], correct='C')

# 4 ─────────────────────────────────────────────
b.q('002dba45', 5, 'MEDIUM', L2, r'''
Line \(k\) is defined by \(y=-\frac{17}{3}x+5\). Line \(j\) is perpendicular to line \(k\) in the \(xy\)-plane. What is the slope of line \(j\)?
''', r'''
The correct answer is \(\frac{3}{17}\). It’s given that line \(j\) is perpendicular to line \(k\) in the \(xy\)-plane. This means that the slope of line \(j\) is the negative reciprocal of the slope of line \(k\). The equation of line \(k\), \(y=-\frac{17}{3}x+5\), is written in slope-intercept form \(y=mx+b\), where \(m\) is the slope of the line and \(b\) is the \(y\)-coordinate of the \(y\)-intercept of the line. It follows that the slope of line \(k\) is \(-\frac{17}{3}\). The negative reciprocal of a number is \(-1\) divided by the number. Therefore, the negative reciprocal of \(-\frac{17}{3}\) is \(\frac{-1}{-\frac{17}{3}}\), or \(\frac{3}{17}\). Thus, the slope of line \(j\) is \(\frac{3}{17}\). Note that 3/17, .1764, .1765, and 0.176 are examples of ways to enter a correct answer.
''', answers=['3/17', '.1764', '.1765', '0.176'], pdf='.1764, .1765, 3/17')

# 5 ─────────────────────────────────────────────
b.q('edc1b7b7', 6, 'HARD', SY, r'''
\[2(8x)+4(7y)=12\]
\[-2(8x)+4(7y)=12\]

The solution to the given system of equations is \((x,y)\). What is the value of \(8x+7y\)?
''', r'''
The correct answer is \(3\). Adding the second equation to the first equation in the given system of equations yields \((2(8x)-2(8x))+(4(7y)+4(7y))=12+12\), or \(8(7y)=24\). Dividing both sides of this equation by \(8\) yields \(7y=3\). Substituting \(3\) for \(7y\) in the first equation, \(2(8x)+4(7y)=12\), yields \(2(8x)+4(3)=12\), or \(2(8x)+12=12\). Subtracting \(12\) from both sides of this equation yields \(2(8x)=0\). Dividing both sides of this equation by \(2\) yields \(8x=0\). Substituting \(0\) for \(8x\) and \(3\) for \(7y\) in the expression \(8x+7y\) yields \(0+3\), or \(3\). Therefore, the value of \(8x+7y\) is \(3\).
''', answers=['3'], pdf='3')

# 6 ─────────────────────────────────────────────
b.q('f224df07', 7, 'MEDIUM', IN, r'''
A cargo helicopter delivers only 100-pound packages and 120-pound packages. For each delivery trip, the helicopter must carry at least 10 packages, and the total weight of the packages can be at most 1,100 pounds. What is the maximum number of 120-pound packages that the helicopter can carry per trip?
''', r'''
Choice C is correct. Let \(a\) equal the number of 120-pound packages, and let \(b\) equal the number of 100-pound packages. It’s given that the total weight of the packages can be at most 1,100 pounds: the inequality \(120a+100b\le 1{,}100\) represents this situation. It’s also given that the helicopter must carry at least 10 packages: the inequality \(a+b\ge 10\) represents this situation. Values of \(a\) and \(b\) that satisfy these two inequalities represent the allowable numbers of 120-pound packages and 100-pound packages the helicopter can transport. To maximize the number of 120-pound packages, \(a\), in the helicopter, the number of 100-pound packages, \(b\), in the helicopter needs to be minimized. Expressing \(b\) in terms of \(a\) in the second inequality yields \(b\ge 10-a\), so the minimum value of \(b\) is equal to \(10-a\). Substituting \(10-a\) for \(b\) in the first inequality results in \(120a+100(10-a)\le 1{,}100\). Using the distributive property to rewrite this inequality yields \(120a+1{,}000-100a\le 1{,}100\), or \(20a+1{,}000\le 1{,}100\). Subtracting 1,000 from both sides of this inequality yields \(20a\le 100\). Dividing both sides of this inequality by 20 results in \(a\le 5\). This means that the maximum number of 120-pound packages that the helicopter can carry per trip is 5.

Choices A, B, and D are incorrect and may result from incorrectly creating or solving the system of inequalities.
''', options=['2', '4', '5', '6'], correct='C')

# 7 ─────────────────────────────────────────────
b.q('fa80893a', 8, 'EASY', L1, r'''
If \(2x+3=9\), what is the value of \(6x-1\)?
''', r'''
The correct answer is \(17\). It’s given that \(2x+3=9\). Multiplying each side of this equation by \(3\) yields \(3(2x+3)=3(9)\), or \(6x+9=27\). Subtracting \(10\) from each side of this equation yields \(6x+9-10=27-10\), or \(6x-1=17\). Therefore, the value of \(6x-1\) is \(17\).
''', answers=['17'], pdf='17')

# 8 ─────────────────────────────────────────────
b.q('bd9eb2b5', 9, 'EASY', LF, r'''
The function \(f\) is defined by \(f(x)=8x\). For what value of \(x\) does \(f(x)=72\)?
''', r'''
Choice B is correct. Substituting \(72\) for \(f(x)\) in the given function yields \(72=8x\). Dividing each side of this equation by \(8\) yields \(9=x\). Therefore, \(f(x)=72\) when the value of \(x\) is \(9\).

Choice A is incorrect. This is the value of \(x\) for which \(f(x)=64\), not \(f(x)=72\).

Choice C is incorrect. This is the value of \(x\) for which \(f(x)=512\), not \(f(x)=72\).

Choice D is incorrect. This is the value of \(x\) for which \(f(x)=640\), not \(f(x)=72\).
''', options=[r'\(8\)', r'\(9\)', r'\(64\)', r'\(80\)'], correct='B')

# 9 ─────────────────────────────────────────────
b.q('1480dd5c', 10, 'MEDIUM', LF, r'''
\[f(x)=4x+b\]

For the linear function \(f\), \(b\) is a constant and \(f(7)=28\). What is the value of \(b\)?
''', r'''
Choice A is correct. For the linear function \(f\), it’s given that \(f(7)=28\). Substituting \(7\) for \(x\) and \(28\) for \(f(x)\) in the given function yields \(28=4(7)+b\), or \(28=28+b\). Subtracting \(28\) from each side of this equation yields \(0=b\). Therefore, the value of \(b\) is \(0\).

Choice B is incorrect. Substituting \(1\) for \(b\) in the given function yields \(f(x)=4x+1\). For this function, when the value of \(x\) is \(7\), the value of \(f(x)\) is \(29\), not \(28\).

Choice C is incorrect. Substituting \(4\) for \(b\) in the given function yields \(f(x)=4x+4\). For this function, when the value of \(x\) is \(7\), the value of \(f(x)\) is \(32\), not \(28\).

Choice D is incorrect. Substituting \(7\) for \(b\) in the given function yields \(f(x)=4x+7\). For this function, when the value of \(x\) is \(7\), the value of \(f(x)\) is \(35\), not \(28\).
''', options=[r'\(0\)', r'\(1\)', r'\(4\)', r'\(7\)'], correct='A')

# 10 ────────────────────────────────────────────
b.q('3008cfc3', 11, 'HARD', L2,
  table([r'\(x\)', r'\(y\)'], [[r'\(k\)', r'\(13\)'], [r'\(k+7\)', r'\(-15\)']]) + r'''

The table gives the coordinates of two points on a line in the \(xy\)-plane. The \(y\)-intercept of the line is \((k-5,b)\), where \(k\) and \(b\) are constants. What is the value of \(b\)?
''', r'''
The correct answer is \(33\). It’s given in the table that the coordinates of two points on a line in the \(xy\)-plane are \((k,13)\) and \((k+7,-15)\). The \(y\)-intercept is another point on the line. The slope computed using any pair of points from the line will be the same. The slope of a line, \(m\), between any two points, \((x_1,y_1)\) and \((x_2,y_2)\), on the line can be calculated using the slope formula, \(m=\frac{y_2-y_1}{x_2-x_1}\). It follows that the slope of the line with the given points from the table, \((k,13)\) and \((k+7,-15)\), is \(m=\frac{-15-13}{k+7-k}\), which is equivalent to \(m=\frac{-28}{7}\), or \(m=-4\). It's given that the \(y\)-intercept of the line is \((k-5,b)\). Substituting \(-4\) for \(m\) and the coordinates of the points \((k-5,b)\) and \((k,13)\) into the slope formula yields \(-4=\frac{13-b}{k-(k-5)}\), which is equivalent to \(-4=\frac{13-b}{k-k+5}\), or \(-4=\frac{13-b}{5}\). Multiplying both sides of this equation by \(5\) yields \(-20=13-b\). Subtracting \(13\) from both sides of this equation yields \(-33=-b\). Dividing both sides of this equation by \(-1\) yields \(b=33\). Therefore, the value of \(b\) is \(33\).
''', answers=['33'], pdf='33')

# 11 ────────────────────────────────────────────
b.q('0d6ab461', 12, 'EASY', LF, r'''
Gabriella deposits \(\$35\) in a savings account at the end of each week. At the beginning of the \(1\text{st}\) week of a year there was \(\$600\) in that savings account. How much money, in dollars, will be in the account at the end of the \(4\text{th}\) week of that year?
''', r'''
Choice D is correct. It’s given that at the beginning of the \(1\text{st}\) week of the year there was \(\$600\) in a savings account and Gabriella deposits \(\$35\) in that savings account at the end of each week. Therefore, the amount of money, in dollars, in the savings account at the end of the \(4\text{th}\) week of that year is \(600+4(35)\), or \(740\).

Choice A is incorrect. This is the amount of money, in dollars, that will be in the account at the end of the \(4\text{th}\) week if Gabriella withdraws, rather than deposits, \(\$35\) at the end of each week.

Choice B is incorrect. This is the amount of money, in dollars, that will be in the account at the end of the \(1\text{st}\) week, not the \(4\text{th}\) week.

Choice C is incorrect and may result from conceptual or calculation errors.
''', options=[r'\(460\)', r'\(635\)', r'\(639\)', r'\(740\)'], correct='D')

# 12 ────────────────────────────────────────────
b.q('4becad44', 13, 'HARD', SY, r'''
\[3x=36y-45\]

One of the two equations in a system of linear equations is given. The system has no solution. Which equation could be the second equation in this system?
''', r'''
Choice B is correct. A system of two linear equations in two variables, \(x\) and \(y\), has no solution when the lines in the \(xy\)-plane representing the equations are parallel and distinct. Two lines are parallel and distinct if their slopes are the same and their \(y\)-intercepts are different. The slope of the graph of the given equation, \(3x=36y-45\), in the \(xy\)-plane can be found by rewriting the equation in the form \(y=mx+b\), where \(m\) is the slope of the graph and \((0,b)\) is the \(y\)-intercept. Adding \(45\) to each side of the given equation yields \(3x+45=36y\). Dividing each side of this equation by \(36\) yields \(\frac{1}{12}x+\frac{5}{4}=y\), or \(y=\frac{1}{12}x+\frac{5}{4}\). It follows that the slope of the graph of the given equation is \(\frac{1}{12}\) and the \(y\)-intercept is \((0,\frac{5}{4})\). Therefore, the graph of the second equation in the system must also have a slope of \(\frac{1}{12}\), but must not have a \(y\)-intercept of \((0,\frac{5}{4})\). Multiplying each side of the equation given in choice B by \(\frac{1}{4}\) yields \(\frac{1}{12}x=y\), or \(y=\frac{1}{12}x\). It follows that the graph representing the equation in choice B has a slope of \(\frac{1}{12}\) and a \(y\)-intercept of \((0,0)\). Since the slopes of the graphs of the two equations are equal and the \(y\)-intercepts of the graphs of the two equations are different, the equation in choice B could be the second equation in the system.

Choice A is incorrect. This equation can be rewritten as \(y=\frac{1}{4}x\). It follows that the graph of this equation has a slope of \(\frac{1}{4}\), so the system consisting of this equation and the given equation has exactly one solution, rather than no solution.

Choice C is incorrect. This equation can be rewritten as \(y=\frac{1}{12}x+\frac{5}{4}\). It follows that the graph of this equation has a slope of \(\frac{1}{12}\) and a \(y\)-intercept of \((0,\frac{5}{4})\), so the system consisting of this equation and the given equation has infinitely many solutions, rather than no solution.

Choice D is incorrect. This equation can be rewritten as \(y=\frac{1}{36}x+\frac{5}{4}\). It follows that the graph of this equation has a slope of \(\frac{1}{36}\), so the system consisting of this equation and the given equation has exactly one solution, rather than no solution.
''', options=[r'\(x=4y\)', r'\(\frac{1}{3}x=4y\)', r'\(x=12y-15\)', r'\(\frac{1}{3}x=12y-15\)'], correct='B')

# 13 ────────────────────────────────────────────
b.q('d1b66ae6', 14, 'HARD', SY, r'''
\[-x+y=-3.5\]
\[x+3y=9.5\]

If \((x,y)\) satisfies the system of equations above, what is the value of \(y\)?
''', r'''
The correct answer is \(\frac{3}{2}\). One method for solving the system of equations for \(y\) is to add corresponding sides of the two equations. Adding the left-hand sides gives \((-x+y)+(x+3y)\), or \(4y\). Adding the right-hand sides yields \(-3.5+9.5=6\). It follows that \(4y=6\). Finally, dividing both sides of \(4y=6\) by 4 yields \(y=\frac{6}{4}\) or \(\frac{3}{2}\). Note that 3/2 and 1.5 are examples of ways to enter a correct answer.
''', answers=['3/2', '1.5'], pdf=None)

# 14 ────────────────────────────────────────────
b.q('cb8f449f', 15, 'MEDIUM', SY, r'''
\[\frac{1}{2}y=4\]
\[x-\frac{1}{2}y=2\]

The system of equations above has solution \((x,y)\). What is the value of \(x\)?
''', r'''
Choice D is correct. Adding the corresponding sides of the two equations eliminates \(y\) and yields \(x=6\), as shown.

\[\begin{array}{r} \frac{1}{2}y=4\\ x-\frac{1}{2}y=2\\ \hline x+0=6 \end{array}\]

If \((x,y)\) is a solution to the system, then \((x,y)\) satisfies both equations in the system and any equation derived from them. Therefore, \(x=6\).

Choices A, B, and C are incorrect and may be the result of errors when solving the system.
''', options=[r'\(3\)', r'\(\frac{7}{2}\)', r'\(4\)', r'\(6\)'], correct='D')

# 15 ────────────────────────────────────────────
b.q('3409707e', 16, 'EASY', SY, r'''
\[x+y=125\]
\[x+y+y=155\]

The solution to the given system of equations is \((x,y)\). What is the value of \(y\)?
''', r'''
The correct answer is \(30\). It’s given that \(x+y=125\). Substituting \(125\) for \(x+y\) in the second equation of the given system yields \(125+y=155\). Subtracting \(125\) from both sides of this equation yields \(y=30\). Therefore, the value of \(y\) is \(30\).
''', answers=['30'], pdf='30')

# 16 ────────────────────────────────────────────
b.q('9b7a1b67', [17, 18], 'HARD', SY,
  figure('fig-p17.png', 'Line h passing through (-6, 0) and (0, -9)', 361, 345) + r'''

The graph of line \(h\) is shown in the \(xy\)-plane. Line \(k\) (not shown) is defined by \(sx+48y=t\), where \(s\) and \(t\) are constants. If line \(k\) is graphed in this \(xy\)-plane, the result is a graph of two linear equations. This system of two linear equations has no solution. Which of the following is <strong>NOT</strong> a possible value of \(t\)?
''', r'''
Choice A is correct. It's given that if line \(k\) is graphed in the \(xy\)-plane with line \(h\), the result is the graph of a system of two linear equations that has no solution. It follows that line \(h\) and line \(k\) don't intersect. This means that line \(k\) and line \(h\) have the same slope and different \(y\)-intercepts. The graph shows that the \(y\)-intercept of line \(h\) is \((0,-9)\). The \(y\)-coordinate of the \(y\)-intercept of line \(k\) is the value of \(y\) when \(x=0\) in the equation defining line \(k\). Substituting \(0\) for \(x\) in the equation \(sx+48y=t\) yields \(s(0)+48y=t\), or \(48y=t\). Dividing both sides of this equation by \(48\) yields \(y=\frac{t}{48}\). Therefore, the \(y\)-coordinate of the \(y\)-intercept of line \(k\) is \(\frac{t}{48}\), so the \(y\)-intercept of line \(k\) is \((0,\frac{t}{48})\). Since line \(k\) and line \(h\) have different \(y\)-intercepts, \(\frac{t}{48}\) can't be equal to \(-9\). It follows that \(t\) can't be equal to \(-9(48)\), or \(-432\). Thus, \(-432\) isn't a possible value of \(t\).

Choice B is incorrect. This isn't a possible value of the \(y\)-coordinate of the \(y\)-intercept of line \(k\), but it is a possible value of \(t\).

Choice C is incorrect. This is the value of \(s\), not a value of \(t\) that isn't possible.

Choice D is incorrect. If \(t=288\), then the \(y\)-intercept of line \(k\) is \((0,\frac{288}{48})\), or \((0,6)\), which is different from the \(y\)-intercept of line \(h\), \((0,-9)\). Therefore, \(288\) is a possible value of \(t\).
''', options=[r'\(-432\)', r'\(-9\)', r'\(72\)', r'\(288\)'], correct='A', figures=['fig-p17.png'])

# 17 ────────────────────────────────────────────
b.q('520c8177', 19, 'EASY', LF, r'''
A veterinarian recommends that each day a certain rabbit should eat \(25\) calories per pound of the rabbit’s weight, plus an additional \(11\) calories. Which equation represents this situation, where \(c\) is the total number of calories the veterinarian recommends the rabbit should eat each day if the rabbit’s weight is \(x\) pounds?
''', r'''
Choice D is correct. It’s given that a veterinarian recommends that each day the rabbit should eat \(25\) calories per pound of the rabbit’s weight, plus an additional \(11\) calories. If the rabbit’s weight is \(x\) pounds, then multiplying \(25\) calories per pound by the rabbit’s weight, \(x\) pounds, yields \(25x\) calories. Adding the additional \(11\) calories that the rabbit should eat each day yields \(25x+11\) calories. It’s given that \(c\) is the total number of calories the veterinarian recommends the rabbit should eat each day if the rabbit’s weight is \(x\) pounds. Therefore, this situation can be represented by the equation \(c=25x+11\).

Choice A is incorrect. This equation represents a situation where a veterinarian recommends that each day the rabbit should eat \(25\) calories per pound of the rabbit’s weight.

Choice B is incorrect. This equation represents a situation where a veterinarian recommends that each day the rabbit should eat \(25+11\), or \(36\), calories per pound of the rabbit’s weight.

Choice C is incorrect. This equation represents a situation where a veterinarian recommends that each day the rabbit should eat \(11\) calories per pound of the rabbit’s weight, plus an additional \(25\) calories.
''', options=[r'\(c=25x\)', r'\(c=36x\)', r'\(c=11x+25\)', r'\(c=25x+11\)'], correct='D')

# 18 ────────────────────────────────────────────
b.q('88e13c8c', 20, 'EASY', LF, r'''
The total cost \(f(x)\), in dollars, to lease a car for \(36\) months from a particular car dealership is given by \(f(x)=36x+1{,}000\), where \(x\) is the monthly payment, in dollars. What is the total cost to lease a car when the monthly payment is \(\$400\)?
''', r'''
Choice C is correct. It's given that \(f(x)\) is the total cost, in dollars, to lease a car from this dealership with a monthly payment of \(x\) dollars. Therefore, the total cost, in dollars, to lease the car when the monthly payment is \(\$400\) is represented by the value of \(f(x)\) when \(x=400\). Substituting \(400\) for \(x\) in the equation \(f(x)=36x+1{,}000\) yields \(f(400)=36(400)+1{,}000\), or \(f(400)=15{,}400\). Thus, when the monthly payment is \(\$400\), the total cost to lease a car is \(\$15{,}400\).

Choice A is incorrect and may result from conceptual or calculation errors.

Choice B is incorrect and may result from conceptual or calculation errors.

Choice D is incorrect and may result from conceptual or calculation errors.
''', options=[r'\(\$13{,}400\)', r'\(\$13{,}000\)', r'\(\$15{,}400\)', r'\(\$37{,}400\)'], correct='C')

# 19 ────────────────────────────────────────────
b.q('744ee7d7', 21, 'EASY', IN,
  figure('fig-p21.png', 'Graph with the region on and above the horizontal line y = 36 shaded', 344, 363) + r'''

The shaded region shown in the graph represents all the solutions to which inequality?
''', r'''
Choice D is correct. The equation for the line representing the boundary of the shaded region can be written in the form \(y=b\), where \((0,b)\) is the \(y\)-intercept of the line in the \(xy\)-plane. For the graph shown in the \(xy\)-plane, the boundary line passes through the points \((-15,36)\) and \((0,36)\). Thus, the equation of the boundary line is \(y=36\). Since the shaded region represents all the points on and above this boundary line, it follows that the graph represents all the solutions to the inequality \(y\ge 36\).

Choice A is incorrect and may result from conceptual errors.

Choice B is incorrect and may result from conceptual errors.

Choice C is incorrect and may result from conceptual errors.
''', options=[r'\(x\le 36\)', r'\(x\ge 36\)', r'\(y\le 36\)', r'\(y\ge 36\)'], correct='D', figures=['fig-p21.png'])

# 20 ────────────────────────────────────────────
b.q('3cdbf026', 22, 'HARD', L2, r'''
The graph of the equation \(ax+ky=6\) is a line in the \(xy\)-plane, where \(a\) and \(k\) are constants. If the line contains the points \((-2,-6)\) and \((0,-3)\), what is the value of \(k\)?
''', r'''
Choice A is correct. The value of \(k\) can be found using the slope-intercept form of a linear equation, \(y=mx+b\), where \(m\) is the slope and \(b\) is the \(y\)-coordinate of the \(y\)-intercept. The equation \(ax+ky=6\) can be rewritten in the form \(y=-\frac{a}{k}x+\frac{6}{k}\). One of the given points, \((0,-3)\), is the \(y\)-intercept. Thus, the \(y\)-coordinate of the \(y\)-intercept \(-3\) must be equal to \(\frac{6}{k}\). Multiplying both sides by \(k\) gives \(-3k=6\). Dividing both sides by \(-3\) gives \(k=-2\).

Choices B, C, and D are incorrect and may result from errors made rewriting the given equation.
''', options=[r'\(-2\)', r'\(-1\)', r'\(2\)', r'\(3\)'], correct='A')

# 21 ────────────────────────────────────────────
b.q('00723d16', 23, 'HARD', L2, r'''
Line \(\ell\) is defined by \(3y+12x=5\). Line \(n\) is perpendicular to line \(\ell\) in the \(xy\)-plane. What is the slope of line \(n\)?
''', r'''
The correct answer is \(\frac{1}{4}\). For an equation in slope-intercept form \(y=mx+b\), \(m\) represents the slope of the line in the \(xy\)-plane defined by this equation. It's given that line \(\ell\) is defined by \(3y+12x=5\). Subtracting \(12x\) from both sides of this equation yields \(3y=-12x+5\). Dividing both sides of this equation by \(3\) yields \(y=-\frac{12}{3}x+\frac{5}{3}\), or \(y=-4x+\frac{5}{3}\). Thus, the slope of line \(\ell\) in the \(xy\)-plane is \(-4\). Since line \(n\) is perpendicular to line \(\ell\) in the \(xy\)-plane, the slope of line \(n\) is the negative reciprocal of the slope of line \(\ell\). The negative reciprocal of \(-4\) is \(-\frac{1}{(-4)}=\frac{1}{4}\). Note that 1/4 and .25 are examples of ways to enter a correct answer.
''', answers=['1/4', '0.25'], pdf='0.25, 1/4')

# 22 ────────────────────────────────────────────
b.q('ff501705', 24, 'HARD', SY, r'''
\[\frac{3}{2}y-\frac{1}{4}x=\frac{2}{3}-\frac{3}{2}y\]
\[\frac{1}{2}x+\frac{3}{2}=py+\frac{9}{2}\]

In the given system of equations, \(p\) is a constant. If the system has no solution, what is the value of \(p\)?
''', r'''
The correct answer is \(6\). A system of two linear equations in two variables, \(x\) and \(y\), has no solution if the lines represented by the equations in the \(xy\)-plane are parallel and distinct. Lines represented by equations in standard form, \(Ax+By=C\) and \(Dx+Ey=F\), are parallel if the coefficients for \(x\) and \(y\) in one equation are proportional to the corresponding coefficients in the other equation, meaning \(\frac{D}{A}=\frac{E}{B}\); and the lines are distinct if the constants are not proportional, meaning \(\frac{F}{C}\) is not equal to \(\frac{D}{A}\) or \(\frac{E}{B}\). The first equation in the given system is \(\frac{3}{2}y-\frac{1}{4}x=\frac{2}{3}-\frac{3}{2}y\). Multiplying each side of this equation by \(12\) yields \(18y-3x=8-18y\). Adding \(18y\) to each side of this equation yields \(36y-3x=8\), or \(-3x+36y=8\). The second equation in the given system is \(\frac{1}{2}x+\frac{3}{2}=py+\frac{9}{2}\). Multiplying each side of this equation by \(2\) yields \(x+3=2py+9\). Subtracting \(2py\) from each side of this equation yields \(x+3-2py=9\). Subtracting \(3\) from each side of this equation yields \(x-2py=6\). Therefore, the two equations in the given system, written in standard form, are \(-3x+36y=8\) and \(x-2py=6\). As previously stated, if this system has no solution, the lines represented by the equations in the \(xy\)-plane are parallel and distinct, meaning the proportion \(\frac{1}{-3}=\frac{-2p}{36}\), or \(-\frac{1}{3}=-\frac{p}{18}\), is true and the proportion \(\frac{6}{8}=\frac{1}{-3}\) is not true. The proportion \(\frac{6}{8}=\frac{1}{-3}\) is not true. Multiplying each side of the true proportion, \(-\frac{1}{3}=-\frac{p}{18}\), by \(-18\) yields \(6=p\). Therefore, if the system has no solution, then the value of \(p\) is \(6\).
''', answers=['6'], pdf='6')

# 23 ────────────────────────────────────────────
b.q('8c5e6702', 25, 'HARD', LF, r'''
A window repair specialist charges \(\$220\) for the first two hours of repair plus an hourly fee for each additional hour. The total cost for \(5\) hours of repair is \(\$400\). Which function \(f\) gives the total cost, in dollars, for \(x\) hours of repair, where \(x\ge 2\)?
''', r'''
Choice A is correct. It’s given that the window repair specialist charges \(\$220\) for the first two hours of repair plus an hourly fee for each additional hour. Let \(n\) represent the hourly fee for each additional hour after the first two hours. Since it’s given that \(x\) is the number of hours of repair, it follows that the charge generated by the hourly fee after the first two hours can be represented by the expression \(n(x-2)\). Therefore, the total cost, in dollars, for \(x\) hours of repair is \(f(x)=220+n(x-2)\). It’s given that the total cost for \(5\) hours of repair is \(\$400\). Substituting \(5\) for \(x\) and \(400\) for \(f(x)\) into the equation \(f(x)=220+n(x-2)\) yields \(400=220+n(5-2)\), or \(400=220+3n\). Subtracting \(220\) from both sides of this equation yields \(180=3n\). Dividing both sides of this equation by \(3\) yields \(n=60\). Substituting \(60\) for \(n\) in the equation \(f(x)=220+n(x-2)\) yields \(f(x)=220+60(x-2)\), which is equivalent to \(f(x)=220+60x-120\), or \(f(x)=60x+100\). Therefore, the total cost, in dollars, for \(x\) hours of repair is \(f(x)=60x+100\).

Choice B is incorrect. This function represents the total cost, in dollars, for \(x\) hours of repair where the specialist charges \(\$340\), rather than \(\$220\), for the first two hours of repair.

Choice C is incorrect. This function represents the total cost, in dollars, for \(x\) hours of repair where the specialist charges \(\$160\), rather than \(\$220\), for the first two hours of repair, and an hourly fee of \(\$80\), rather than \(\$60\), after the first two hours.

Choice D is incorrect. This function represents the total cost, in dollars, for \(x\) hours of repair where the specialist charges \(\$380\), rather than \(\$220\), for the first two hours of repair, and an hourly fee of \(\$80\), rather than \(\$60\), after the first two hours.
''', options=[r'\(f(x)=60x+100\)', r'\(f(x)=60x+220\)', r'\(f(x)=80x\)', r'\(f(x)=80x+220\)'], correct='A')

# 24 ────────────────────────────────────────────
b.q('2937ef4f', 26, 'HARD', L1, r'''
Hector used a tool called an auger to remove corn from a storage bin at a constant rate. The bin contained 24,000 bushels of corn when Hector began to use the auger. After 5 hours of using the auger, 19,350 bushels of corn remained in the bin. If the auger continues to remove corn at this rate, what is the total number of hours Hector will have been using the auger when 12,840 bushels of corn remain in the bin?
''', r'''
Choice D is correct. After using the auger for 5 hours, Hector had removed \(24{,}000-19{,}350=4{,}650\) bushels of corn from the storage bin. During the 5-hour period, the auger removed corn from the bin at a constant rate of \(\frac{4{,}650}{5}=930\) bushels per hour. Assuming the auger continues to remove corn at this rate, after \(x\) hours it will have removed \(930x\) bushels of corn. Because the bin contained 24,000 bushels of corn when Hector started using the auger, the equation \(24{,}000-930x=12{,}840\) can be used to find the number of hours, \(x\), Hector will have been using the auger when 12,840 bushels of corn remain in the bin. Subtracting 12,840 from both sides of this equation and adding \(930x\) to both sides of the equation yields \(11{,}160=930x\). Dividing both sides of this equation by 930 yields \(x=12\). Therefore, Hector will have been using the auger for 12 hours when 12,840 bushels of corn remain in the storage bin.

Choice A is incorrect. Three hours after Hector began using the auger, \(24{,}000-3(930)=21{,}210\) bushels of corn remained, not 12,840. Choice B is incorrect. Seven hours after Hector began using the auger, \(24{,}000-7(930)=17{,}490\) bushels of corn will remain, not 12,840. Choice C is incorrect. Eight hours after Hector began using the auger, \(24{,}000-8(930)=16{,}560\) bushels of corn will remain, not 12,840.
''', options=['3', '7', '8', '12'], correct='D')

# 25 ────────────────────────────────────────────
b.q('548a4929', 27, 'MEDIUM', LF, r'''
The function \(h\) is defined by \(h(x)=4x+28\). The graph of \(y=h(x)\) in the \(xy\)-plane has an \(x\)-intercept at \((a,0)\) and a \(y\)-intercept at \((0,b)\), where \(a\) and \(b\) are constants. What is the value of \(a+b\)?
''', r'''
Choice A is correct. The \(x\)-intercept of a graph in the \(xy\)-plane is the point on the graph where \(y=0\). It's given that function \(h\) is defined by \(h(x)=4x+28\). Therefore, the equation representing the graph of \(y=h(x)\) is \(y=4x+28\). Substituting \(0\) for \(y\) in the equation \(y=4x+28\) yields \(0=4x+28\). Subtracting \(28\) from both sides of this equation yields \(-28=4x\). Dividing both sides of this equation by \(4\) yields \(-7=x\). Therefore, the \(x\)-intercept of the graph of \(y=h(x)\) in the \(xy\)-plane is \((-7,0)\). It's given that the \(x\)-intercept of the graph of \(y=h(x)\) is \((a,0)\). Therefore, \(a=-7\). The \(y\)-intercept of a graph in the \(xy\)-plane is the point on the graph where \(x=0\). Substituting \(0\) for \(x\) in the equation \(y=4x+28\) yields \(y=4(0)+28\), or \(y=28\). Therefore, the \(y\)-intercept of the graph of \(y=h(x)\) in the \(xy\)-plane is \((0,28)\). It's given that the \(y\)-intercept of the graph of \(y=h(x)\) is \((0,b)\). Therefore, \(b=28\). If \(a=-7\) and \(b=28\), then the value of \(a+b\) is \(-7+28\), or \(21\).

Choice B is incorrect. This is the value of \(b\), not \(a+b\).

Choice C is incorrect and may result from conceptual or calculation errors.

Choice D is incorrect. This is the value of \(-a+b\), not \(a+b\).
''', options=[r'\(21\)', r'\(28\)', r'\(32\)', r'\(35\)'], correct='A')

# 26 ────────────────────────────────────────────
b.q('0adbe034', 28, 'EASY', L1, r'''
If \(4x-28=-24\), what is the value of \(x-7\)?
''', r'''
Choice C is correct. Dividing all terms in the given equation by \(4\) yields \(\frac{4x}{4}-\frac{28}{4}=-\frac{24}{4}\), or \(x-7=-6\). Therefore, the value of \(x-7\) is \(-6\).

Choice A is incorrect. This is the value of \(4x-28\), not \(x-7\).

Choice B is incorrect and may result from conceptual or calculation errors.

Choice D is incorrect and may result from conceptual or calculation errors.
''', options=[r'\(-24\)', r'\(-22\)', r'\(-6\)', r'\(-1\)'], correct='C')

# 27 ────────────────────────────────────────────
b.q('9bbce683', 29, 'HARD', L2,
  table([r'\(x\)', r'\(y\)'], [[r'\(18\)', r'\(130\)'], [r'\(23\)', r'\(160\)'], [r'\(26\)', r'\(178\)']]) + r'''

For line \(h\), the table shows three values of \(x\) and their corresponding values of \(y\). Line \(k\) is the result of translating line \(h\) down \(5\) units in the \(xy\)-plane. What is the \(x\)-intercept of line \(k\)?
''', r'''
Choice D is correct. The equation of line \(h\) can be written in slope-intercept form \(y=mx+b\), where \(m\) is the slope of the line and \((0,b)\) is the \(y\)-intercept of the line. It’s given that line \(h\) contains the points \((18,130)\), \((23,160)\), and \((26,178)\). Therefore, its slope \(m\) can be found as \(\frac{160-130}{23-18}\), or \(6\). Substituting \(6\) for \(m\) in the equation \(y=mx+b\) yields \(y=6x+b\). Substituting \(130\) for \(y\) and \(18\) for \(x\) in this equation yields \(130=6(18)+b\), or \(130=108+b\). Subtracting \(108\) from both sides of this equation yields \(22=b\). Substituting \(22\) for \(b\) in \(y=6x+b\) yields \(y=6x+22\). Since line \(k\) is the result of translating line \(h\) down \(5\) units, an equation of line \(k\) is \(y=6x+22-5\), or \(y=6x+17\). Substituting \(0\) for \(y\) in this equation yields \(0=6x+17\). Solving this equation for \(x\) yields \(x=-\frac{17}{6}\). Therefore, the \(x\)-intercept of line \(k\) is \((-\frac{17}{6},0)\).

Choice A is incorrect and may result from conceptual or calculation errors.

Choice B is incorrect and may result from conceptual or calculation errors.

Choice C is incorrect and may result from conceptual or calculation errors.
''', options=[r'\((-\frac{26}{3},0)\)', r'\((-\frac{9}{2},0)\)', r'\((-\frac{11}{3},0)\)', r'\((-\frac{17}{6},0)\)'], correct='D')

# 28 ────────────────────────────────────────────
b.q('2b15d65f', 30, 'HARD', LF, r'''
An economist modeled the demand \(Q\) for a certain product as a linear function of the selling price \(P\). The demand was 20,000 units when the selling price was $40 per unit, and the demand was 15,000 units when the selling price was $60 per unit. Based on the model, what is the demand, in units, when the selling price is $55 per unit?
''', r'''
Choice A is correct. Let the economist’s model be the linear function \(Q=mP+b\), where \(Q\) is the demand, \(P\) is the selling price, \(m\) is the slope of the line, and \(b\) is the \(y\)-coordinate of the \(y\)-intercept of the line in the \(xy\)-plane, where \(y=Q\). Two pairs of the selling price \(P\) and the demand \(Q\) are given. Using the coordinate pairs \((P,Q)\), two points that satisfy the function are \((40,20{,}000)\) and \((60,15{,}000)\). The slope \(m\) of the function can be found using the formula \(m=\frac{Q_2-Q_1}{P_2-P_1}\). Substituting the given values into this formula yields \(m=\frac{15{,}000-20{,}000}{60-40}\), or \(m=-250\). Therefore, \(Q=-250P+b\). The value of \(b\) can be found by substituting one of the points into the function. Substituting the values of \(P\) and \(Q\) from the point \((40,20{,}000)\) yields \(20{,}000=-250(40)+b\), or \(20{,}000=-10{,}000+b\). Adding 10,000 to both sides of this equation yields \(b=30{,}000\). Therefore, the linear function the economist used as the model is \(Q=-250P+30{,}000\). Substituting 55 for \(P\) yields \(Q=-250(55)+30{,}000=16{,}250\). It follows that when the selling price is $55 per unit, the demand is 16,250 units.

Choices B, C, and D are incorrect and may result from calculation or conceptual errors.
''', options=['16,250', '16,500', '16,750', '17,500'], correct='A')

# 29 ────────────────────────────────────────────
b.q('e25f0807', 31, 'HARD', LF,
  table([r'\(x\)', r'\(y\)'], [[r'\(-12\)', r'\(-45\)'], [r'\(6\)', r'\(45\)']]) + r'''

The table shows two values of \(x\) and their corresponding values of \(y\). The graph of the linear equation representing this relationship passes through the point \((\frac{1}{4},a)\). What is the value of \(a\)?
''', r'''
The correct answer is \(\frac{65}{4}\). The linear relationship between \(x\) and \(y\) can be represented by the equation \(y=mx+b\), where \(m\) and \(b\) are constants. It's given in the table that when \(x=-12\), \(y=-45\). Substituting \(-12\) for \(x\) and \(-45\) for \(y\) in the equation \(y=mx+b\) yields \(-45=-12m+b\), which can be rewritten as \(-45+12m=b\). It's also given in the table that when \(x=6\), \(y=45\). Substituting \(6\) for \(x\) and \(45\) for \(y\) in the equation \(y=mx+b\) yields \(45=6m+b\), which can be rewritten as \(45-6m=b\). Substituting \(-45+12m\) for \(b\) in this equation yields \(45-6m=-45+12m\). Adding \(6m\) to both sides of this equation yields \(45=-45+18m\). Adding \(45\) to both sides of this equation yields \(90=18m\). Dividing both sides of this equation by \(18\) yields \(5=m\), or \(m=5\). Substituting \(5\) for \(m\), \(-12\) for \(x\), and \(-45\) for \(y\) in the equation \(y=mx+b\) yields \(-45=5(-12)+b\), or \(-45=-60+b\). Adding \(60\) to both sides of this equation yields \(15=b\). Therefore, \(m=5\) and \(b=15\). Substituting \(5\) for \(m\) and \(15\) for \(b\) in the equation \(y=mx+b\) yields \(y=5x+15\). Thus, the equation \(y=5x+15\) represents the linear relationship between \(x\) and \(y\). It’s also given that the graph of the linear equation representing this relationship passes through the point \((\frac{1}{4},a)\). Substituting \(\frac{1}{4}\) for \(x\) and \(a\) for \(y\) in the equation \(y=5x+15\) yields \(a=5(\frac{1}{4})+15\), which is equivalent to \(a=\frac{5}{4}+15\), or \(a=\frac{65}{4}\). Note that 65/4 and 16.25 are examples of ways to enter a correct answer.
''', answers=['65/4', '16.25'], pdf='16.25, 65/4')

# 30 ────────────────────────────────────────────
b.q('686b7244', 32, 'HARD', L2, r'''
A certain apprentice has enrolled in \(85\) hours of training courses. The equation \(10x+15y=85\) represents this situation, where \(x\) is the number of on-site training courses and \(y\) is the number of online training courses this apprentice has enrolled in. How many more hours does each online training course take than each on-site training course?
''', r'''
The correct answer is \(5\). It's given that the equation \(10x+15y=85\) represents the situation, where \(x\) is the number of on-site training courses, \(y\) is the number of online training courses, and \(85\) is the total number of hours of training courses the apprentice has enrolled in. Therefore, \(10x\) represents the number of hours the apprentice has enrolled in on-site training courses, and \(15y\) represents the number of hours the apprentice has enrolled in online training courses. Since \(x\) is the number of on-site training courses and \(y\) is the number of online training courses the apprentice has enrolled in, \(10\) is the number of hours each on-site course takes and \(15\) is the number of hours each online course takes. Subtracting these numbers gives \(15-10\), or \(5\) more hours each online training course takes than each on-site training course.
''', answers=['5'], pdf='5')



b.write(sys.argv[1])
