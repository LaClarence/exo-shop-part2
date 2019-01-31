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
```

Nous créons maintenant un fichier ./routes/student.js qui contiendra les routes que nous avions l'habitude de définir dans
le fichier index.js

```javascript
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

### Review and Rating

Afin de permettre à vos clients de donner leurs avis sur vos produits, créez une collection Review avec les attributs suivants :

```javascript
mongoose.model("Review", {
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    minlength: 0,
    maxlength: 150,
    trim: true,
    required: true
  },
  username: {
    type: String,
    minlength: 3,
    maxlength: 15,
    trim: true,
    required: true
  }
});
```

Ajoutez aussi les attributs suivants à la collection **Product** existante :

```javascript
mongoose.model("Product", {
  // ...
  // Ci-dessous, nous faisons en sorte qu'un produit puisse être lié à plusieurs avis (remarquez la présence du tableau)
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  averageRating: { type: Number, min: 0, max: 5 }
  // ...
});
```

#### Create

Attention : Vous ne devrez pas ajouter d'attribut product à la collection Review.
Cette valeur sera utile pour retrouver le produit à mettre à jour.

- **POST** http://localhost:3000/review/create
- Paramètres Body :
  - product (identifiant du produit associé à l'avis).
  - rating (nouvelle note)
  - comment (nouveau commentaire)
  - username (nom de l'utilisateur)

Lorsqu'un avis sera créé :

L'attribut averageRating (Number) du produit associé devra être mis à jour pour calculer la nouvelle note moyenne.
L'attribut reviews (Array) du produit associé devra être mis à jour pour contenir l'identifiant du nouvel avis.
Voir l'exemple ci-dessous:

```JavaScript
if (product.reviews === undefined) {
  product.reviews = [];
}
product.reviews.push(review); // `review` représente l'avis qui vient d'être créé
await product.save();
```

#### Update

- POST http://localhost:3000/review/update
- Paramètres Query :
  - id (identifiant de l'élément à modifier)
- Paramètres Body :
  - rating (nouvelle note)
  - comment (nouveau commentaire)

#### Delete

- POST http://localhost:3000/review/delete
- Paramètres Query :
  - id (identifiant de l'élément à supprimer)

Lorsqu'un avis sera supprimé :
L'attribut reviews (Array) du produit associé devra être mis à jour pour ne plus contenir l'identifiant de l'avis supprimé.
Pour retrouver le produit associé à un avis :

```javascript
Product.find({ reviews: { $in: [req.query.id] } });
```

La note moyenne du produit devra être mise à jour.

### Product

Modifiez votre route _/product_ afin qu'elle puisse permettre d'obtenir les notes moyennes ainsi que les avis des utilisateurs (rating, comment et username).
Pour cela, vous devrez ajouter un **populate**.
Ajoutez les options rating-asc et rating-desc du paramètre Query sort afin de permettre de trier les produits par notes moyennes.

Ajoutez le paramètre Query page afin de permettre d'obtenir seulement 20 résultats par page. Par exemple, pour afficher la 3ème page : http://localhost:3000/product?page=3
Mots clés Google qui pourraient vous aider "mongoose skip limit"

### Bonus

Utilisez le package [Faker.js](https://github.com/marak/Faker.js/) pour générer des faux noms de produits et ainsi créer 100000 produits pour votre base de données.
