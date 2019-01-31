# Le Reacteur - BE 04 - Exo serveur Boutique en ligne

Continue online shop exercice from live correction.

## Express Router

Sur les projets qui commencent à prendre de l'ampleur, il devient vite nécessaire de séparer le code source en plusieurs fichiers. Pour cela, nous allons utiliser _express.Router()_.

### Exemple:

Dans notre fichier index.js, nous importons les routes qui se trouveront dans le fichier _./routes/student.js_

```javascript
const express = require("express");
const app = express();

const studentRoutes = require("./routes/student");
app.use(studentRoutes);

app.listen(3000, () => console.log("Server started"));
Nous créons maintenant un fichier ./routes/student.js qui contiendra les routes que nous avions l'habitude de définir dans le fichier index.js
const express = require("express");
const router = express.Router();

router.get("/student", (req, res) => {
  res.json({ message: "Students List" });
});

router.post("/student/create", (req, res) => {
  res.json({ message: "Create Student" });
});

module.exports = router;
```

## Boutique en ligne - Suite

### Refactoring

Votre fichier _index.js_ commence à contenir beaucoup trop de lignes ?
Refactorisez votre code à l'aide de express.Router().
Pour cela, créez 3 fichiers qui contiendront vos routes :

```shell
routes/department.js
routes/category.js
routes/product.js
```

https://github.com/FaridSafi/shop/commit/767b56a6807dca245df7636fe52dd3cba4df3e3d
https://github.com/FaridSafi/shop/commit/25f4a788ee0c19d66a8a0bdccb2857b96bb74dd2

### Review and Rating
