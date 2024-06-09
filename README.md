## Knottingham
<img src="https://fi-le.net/images/knottingham.gif">

is a tool that lets you draw and manipulate knot diagrams, sporting a clean yet somewhat hand-made look. 
You can:
1. Draw a knot from scratch & Have its intersections calculated for you
2. Adjust it as a Bezier curve
3. and Export it to TikZ/SVG/JSON!

other features include:
- Computing the Alexander, Jones and HOMFLY Polynomial
- Undoing
- Styling
- Non-Reidemeister Move detection


<img src="https://fi-le.net/images/knot.svg">

You can give it a go yourself over [here](https://fi-le.net/knottingham).

 **Local Execution / Development**
---
For a local setup, clone the repository, run a webserver in the base directory for example with `python3 -m http.server 8000` and open a browser window on [http://localhost:8000](http://localhost:8000).

 **Heritage**
 ---
**Knottingham** was inspired by two cool tools for drawing and identifying knots, namely the [Knot Identification Tool](https://joshuahhh.com/projects/kit/) by Joshua Horowitz and [KnotFolio](https://kmill.github.io/knotfolio/index.html) by Kyle Miller. For the feature of producing a minimal orthogonal knot diagram, it uses the PyPi Module [spherogram](https://github.com/3-manifolds/Spherogram) after compilation to Webassembly to be compatible with [pyodide](https://github.com/pyodide/pyodide). Spherogram is licensed under [GNU-2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt). For more involved knot invariants using Sage, API calls to [SageCell](https://sagecell.sagemath.org/) are used.
Knottingham renders with [paper.js](https://github.com/paperjs/paper.js). Many thanks to the authors!

 **How it Works**
---
You can read the preprint about Knottingham [here](https://arxiv.org/abs/2309.00445) or the finished paper in the [*IEEE Transactions on Visualization and Computer Graphics*](https://ieeexplore.ieee.org/document/10538424). 

 **License**
---
**Knottingham** is free software and licensed under MIT.

Any and all feedback is appreciated! You can mail to [developer/at/fi-le.net](mailto:developer/at/fi-le.net).

