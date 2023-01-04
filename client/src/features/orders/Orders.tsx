import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import LoadingCpmponent from "../../app/layout/LoadingComponent";
import { Order } from "../../app/models/Order"
import OrderDetails from "./OrderDetail";

export default function Orders() {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [loading, setLoading] = useState(true);

    const [selectedOrder, setOrderDetail] = useState<Order | null>(null)

    useEffect(() => {
        setLoading(true)
        agent.Orders.list()
            .then(orders => setOrders(orders as any))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }, []);

   
    if (loading) return <LoadingCpmponent message="Loading orders ..." />

    if(selectedOrder){
       return(<OrderDetails order={selectedOrder} setCurrentOrder={setOrderDetail}/>) 
    }

    console.log(orders)
        return (
            <>
            <Typography sx={{p:2}} gutterBottom variant="h4">Orders</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Order number</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="right">Order Date</TableCell>
                            <TableCell align="right">Order Status</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders?.map((order: Order) => (
                            <TableRow
                                key={order.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {order.id}
                                </TableCell>
                                <TableCell align="right">${order.total}</TableCell>
                                <TableCell align="right">{order.orderDate.split('T')[0]}</TableCell>
                                <TableCell align="right">{order.orderStatus}</TableCell>
                                <TableCell align="right">
                                    <Button onClick={
                                        () => {
                                            setOrderDetail(order)
                                        }
                                    }
                                    >View</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </>
            
        )
    


}