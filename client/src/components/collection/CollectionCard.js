import { React, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "react-materialize";
import { Menu, MenuItem } from "@material-ui/core";
import { useHttp } from "../../hooks/http.hook";
import { Image } from "cloudinary-react";
import RemoveAlert from "../technical/RemoveAlert";
import UpdateCollectionModal from "./UpdateCollectionModal";
const CollectionCard = ({ collection, setCollections }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const { loading, request } = useHttp();
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleOpenAlert = () => {
    setOpenAlert(true);
    handleCloseMenu();
  };
  const handleOpenEdit = () => {
    setOpenUpdate(true);
    handleCloseMenu();
  };
  const deleteHandler = async () => {
    try {
      const response = await request(
        "/api/collections/removeCollection",
        "POST",
        { id: collection._id, ownerId: collection.ownerId }
      );
      setOpenAlert(false);
      setCollections([...response]);
    } catch (e) {}
  };
  const updateHandler = async (update) => {
    try {
      const response = await request("/api/collections/updateCollection", "POST", {
        ...update 
      });
      setCollections([...response])
      setOpenUpdate(false);
    } catch {}
  };
  return (
    <div className="card col s12 m4 hoverable">
      <div className="card-image">
        <Image
          cloudName="dxqkl2we4"
          height={300}
          publicId={collection.imageId}
        />
        <button
          aria-controls="menu"
          aria-haspopup="true"
          onClick={handleClickMenu}
          className="btn-floating halfway-fab waves-effect waves-light  indigo darken-1"
        >
          <Icon>build</Icon>
        </button>
      </div>
      <div className="card-content">
        <span className="card-title">{collection.title}</span>
        <p>
          Type:
          <Link
            className="blue-grey-text text-darken-2"
            to={`/profile/${collection.ownerId}`}
          >
            {` ${collection.subject}`}
          </Link>
        </p>
        <p>
          Author:
          <Link
            className="blue-grey-text text-darken-2"
            to={`/profile/${collection.ownerId}`}
          >
            {` ${collection.ownerName}`}
          </Link>
        </p>
      </div>
      <div className="card-actions">
        <Link key={collection._id} to={`/collection/${collection._id}`}>
          <button className="btn-flat right" style={{ marginBottom: "10px" }}>
            Подробнее
          </button>
        </Link>
      </div>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleOpenEdit}>Редактировать</MenuItem>
        <MenuItem onClick={handleOpenAlert}>Удалить коллекцию</MenuItem>
      </Menu>
      <RemoveAlert
        open={openAlert}
        setOpen={setOpenAlert}
        loading={loading}
        onAccept={deleteHandler}
      />
      <UpdateCollectionModal
        open={openUpdate}
        setOpen={setOpenUpdate}
        collection={collection}
        updateHandler={updateHandler}
        loading={loading}
      />
    </div>
  );
};

export default CollectionCard;
