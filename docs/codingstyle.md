Naming
- acronyms should be camel case e.g. ```makeApiCall()``` not ```makeAPICall()```
- 
- backend 
  - strictPascalCase
  - TODO eslint enforcement
  - TODO existing code have quite a few variable_with_underscore
css styling
- use ```kebab-case``` for css class naming
  - dont use BEM naming, with the use of css modules at component level, you should be able to get meaningful names without clashing.
- global css only for things that should apply globally
  - things like theme colour scheme etc
- component level styling
  - use css modules for component level styling
    - name the file ```<ComponentName.module.css```
    - TODO: some component still using ```styles.module.css```
  - add a style class and use ```@apply``` to apply tailwind uitility class
  - in the component file import the style and refer to them using ```{styles['css-class']}``` 
    - you have to use the square bracket notation instead of the dot notation because of the dash in the classname
    - 