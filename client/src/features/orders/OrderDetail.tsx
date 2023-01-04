import { Box, Button, Grid, Link, Typography } from "@mui/material";
import { BasketItem } from "../../app/models/Basket";
import { Order } from "../../app/models/Order"
import BasketSummary from "../basket/BasketSummary";
import BasketTable from "../basket/BasketTable";

interface Props {
    order: Order;
    setCurrentOrder: (order: any) => void;
}

export default function OrderDetails({ order, setCurrentOrder }: Props) {
    const subtotal = order?.orderItems.reduce((sum,item)=> sum + (item.price*item.quantity), 0) ?? 0

    return (
        <>
            <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ p: 2 }} gutterBottom variant="h4"> Order# {order.id}</Typography>
                <Button
                    sx={{ m: 2 }}
                    size='large'
                    variant="contained"
                    onClick={() => setCurrentOrder(null)}
                >Return Orders</Button>
            </Box>

            <BasketTable items={order.orderItems as BasketItem[]} isBasket={false} />
            <Grid container>
                <Grid item xs={6} />
                <Grid item xs={6}>
                    <BasketSummary subtotal={subtotal}/>
                  
                </Grid>
            </Grid>
        </>

    )
}