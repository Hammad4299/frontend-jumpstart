@import will output css-renderable text always irrespective of common chunk plugin. It won't extract common text.
    However, if you import from entrypoint, then commonchunk will work but you won't be able to use imported content in less since it was imported from js
Compile common sass separately and include it separately.
    If need to extend some class from common in specific, create that class with '%' inside _extendables and extend it both common and in specific (by importing _extendable [not common])
That's why only try to import non css-renderable files inside specific sass so that no renderable content is duplicated.
    Then include common css in html page as well as specific css