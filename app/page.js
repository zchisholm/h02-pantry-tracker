'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from '@/firebase';
import { Box, Typography } from "@mui/material";

export default function Home() {
  const [Inventory, setInventory] = useState([])
  const [open, setOpen] = userState([])
  const [itemName, setItemName] = userState('')

  const updateInventory = async 90 => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  return(
    <Box>
      <Typography variant ="h1">Inventory Management</Typography>
    </Box>
  )
}
