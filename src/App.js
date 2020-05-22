import React, { useState, useEffect } from "react";

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

import initSdk from '@gnosis.pm/safe-apps-sdk'
import './App.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  
}));


function Collectibles() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [safeInfo, setSafeInfo] = useState();
  const [appsSdk] = useState(initSdk());

  useEffect(() => {
    if (safeInfo !== undefined) {
      const network = safeInfo.network.toLowerCase() == 'mainnet'?'mainnet.':''
      fetch(`https://safe-transaction.${network}staging.gnosisdev.com/api/v1/safes/${safeInfo.safeAddress}/collectibles/`)
        .then(response => response.json())
        .then(data => {setLoading(false); setData(data)});
    }
  }, [safeInfo]);


  useEffect(() => {
    appsSdk.addListeners({
      onSafeInfo: setSafeInfo,
    });

    return () => appsSdk.removeListeners();
  }, [appsSdk]);

  
  return (
    <div>
      {loading && <CircularProgress />}
      <GridList cellHeight={200} className={classes.gridList} cols={3}>
        {data.map((el) => (
          <GridListTile key={`${el.address}-${el.id}`} cols={1}>
            <img style={{height: '150px', 'object-fit': 'contain'}} src={el.imageUri} alt={el.description} />
            <GridListTileBar
              title={el.name}
              subtitle={<span>{el.description}</span>}
              actionIcon={
                <a href={el.uri} target="_blank">
                  <IconButton aria-label={el.uri} className={classes.icon}>
                    <InfoIcon />
                  </IconButton>
                </a>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Collectibles />
    </div>
  );
}

export default App;
