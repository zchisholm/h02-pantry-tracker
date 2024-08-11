"use client";
import { useState, useEffect, useRef } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  TextField,
  Typography,
  Stack,
  Button,
  Grid,
  Paper,
  InputAdornment,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  getDoc,
  setDoc,
  doc,
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notFound, setNotFound] = useState(false);
  const inventoryRef = useRef(null);
  const itemRefs = useRef({});

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
    setNotFound(searchTerm !== "" && filtered.length === 0);

    if (filtered.length > 0 && searchTerm !== "") {
      const firstMatch = filtered[0].name;
      setTimeout(() => {
        if (itemRefs.current[firstMatch]) {
          itemRefs.current[firstMatch].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  }, [searchTerm, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.filter(String).map((part, i) => {
          return regex.test(part) ? (
            <span key={i} style={{ backgroundColor: "yellow" }}>
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          );
        })}
      </span>
    );
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Paper elevation={3} sx={{ width: "800px", overflow: "hidden" }}>
        <Box
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={2}
        >
          <Typography variant="h4" color="#333">
            Inventory Items
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            Add Item
          </Button>
        </Box>

        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {notFound && (
          <Alert severity="info" sx={{ mx: 2 }}>
            No items found matching "{searchTerm}"
          </Alert>
        )}

        <Box sx={{ maxHeight: "400px", overflow: "auto" }} ref={inventoryRef}>
          {filteredInventory.map(({ name, quantity }) => (
            <Paper
              key={name}
              elevation={1}
              sx={{ m: 2, p: 2 }}
              ref={(el) => (itemRefs.current[name] = el)}
            >
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={5}>
                  <Typography variant="h6" color="#333">
                    {highlightText(
                      name.charAt(0).toUpperCase() + name.slice(1),
                      searchTerm
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="h6" color="#333" textAlign="center">
                    {quantity}
                  </Typography>
                </Grid>
                <Grid item xs={5}>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => addItem(name)}
                    >
                      Add
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => removeItem(name)}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
