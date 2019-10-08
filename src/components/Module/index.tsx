import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IModule } from '~types';
import MarkdownRenderer from '~components/MarkdownRenderer';

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    margin: 0,
    padding: 0,
    [theme.breakpoints.up('lg')]: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
  },
  root: {
    [theme.breakpoints.only('xs')]: {
      margin: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      margin: theme.spacing(3),
    },
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(2, 4),
      padding: theme.spacing(1),
      width: '100%',
      maxWidth: 1000,
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    padding: theme.spacing(2, 0, 0, 2),
    width: `calc(100% - 64px - ${theme.spacing(2) * 3}px)`,
  },
  title: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleChip: {
    display: 'flex',
  },
  versionChip: {
    marginRight: theme.spacing(1),
  },
  body: {
    display: 'flex',
    padding: theme.spacing(2, 2, 0, 2),
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  imageOuter: {
    alignSelf: 'center',
    justifySelf: 'center',
    [theme.breakpoints.up('md')]: {
      maxWidth: 320,
      padding: theme.spacing(0, 2, 0, 0),
    },
    [theme.breakpoints.down('sm')]: {
      flexGrow: 1,
      paddingLeft: 0,
    },
  },
  image: {
    maxHeight: '180px',
    objectFit: 'contain',
    maxWidth: 320,
  },
  actions: {
    width: '300px',
  },
  viewButton: {
    margin: theme.spacing(4, 2, 2, 0),
  },
}));

interface IModuleProps extends RouteComponentProps<{}> {
  module: IModule;
}

export default withRouter(({ module, history }: IModuleProps) => {
  const classes = useStyles();

  const onClickModule = (): void => {
    history.push(`/modules/search/${module.name}`);
  };

  return (
    <div className={classes.wrapper}>
      <Paper
        className={classes.root}
        elevation={4}
      >
        <div className={classes.header}>
          <div className={classes.titleContainer}>
            <div className={classes.titleChip}>
              <Typography className={classes.title} variant="h5">
                {module.name}
              </Typography>
            </div>
            <Typography className={classes.title} variant="h6">
              By
              {' '}
              {module.owner.name}
            </Typography>
          </div>
          <Button
            className={classes.viewButton}
            color="primary"
            variant="contained"
            onClick={onClickModule}
          >
            View
          </Button>
        </div>
        <div className={classes.body}>
          {module.image && (
            <div className={classes.imageOuter}>
              <img
                className={classes.image}
                src={module.image}
                alt="Module"
              />
            </div>
          )}
          <div>
            <MarkdownRenderer source={module.description} />
          </div>
        </div>
      </Paper>
    </div>
  );
});
