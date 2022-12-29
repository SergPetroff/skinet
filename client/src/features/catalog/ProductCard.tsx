import { CardMedia, Button, Card, CardActions, CardContent, Typography, CardHeader, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { Product } from "../../app/models/Product";
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync } from "../basket/basketSlice";


interface Props {
  product: Product
}
export default function ProductCard({ product }: Props) {
  const { status } = useAppSelector(state => state.basket);
  const dispatch = useAppDispatch();


  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: { fontWeight: 'bold', color: 'primary.main' }
        }}
      />
      <CardMedia

        sx={{ height: 180, backgroundSize: 'contain', bgcolor: "primary.light" }}
        image={product.pictureUrl}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" color="secondary">
          ${product.price.toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.productBrand?.name} / {product.productType?.name}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton loading={status.includes('pendingAddItem' + product.id)}
          onClick={
            () => dispatch(addBasketItemAsync({ productId: product.id }))
          }
          size="small">Add to card</LoadingButton>
        <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
      </CardActions>
    </Card>
  )
}