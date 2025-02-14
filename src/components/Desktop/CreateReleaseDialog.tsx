import React from 'react';
import {
  TextField,
  Typography,
  Button,
  Dialog,
  Container,
  CircularProgress,
  Theme,
  colors,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import MarkdownEditor from '~components/MarkdownEditor';
import { createRelease, getModules } from '~api';
import { modulesStore, apiStore, runInAction } from '~store';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minWidth: 800,
    padding: theme.spacing(4),
  },
  versions: {
    marginTop: theme.spacing(4),
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'right',
  },
  scriptButton: {
    width: 200,
  },
  submitButton: {
    marginRight: theme.spacing(2),
    backgroundColor: colors.green[400],
  },
  cancelButton: {
    backgroundColor: colors.red[300],
  },
  textField: {
    margin: theme.spacing(0, 4),
  },
  editor: {
    margin: theme.spacing(4, 0),
  },
}));

interface ICreateReleaseDialog {
  open: boolean;
  onClose(): void;
}

export default ({ open, onClose }: ICreateReleaseDialog): JSX.Element => {
  const classes = useStyles();
  const fileRef = React.createRef<HTMLInputElement>();
  // eslint-disable-next-line max-len
  const semvarRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

  const [releaseVersion, setReleaseVersion] = React.useState('');
  const [releaseError, setReleaseError] = React.useState(true);
  const [modVersion, setModVersion] = React.useState('1.0.0');
  const [changelog, setChangelog] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onChangeReleaseVersion = ({ target }: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    setReleaseVersion(target.value as string);
    setReleaseError(!semvarRegex.test(target.value as string));
  };

  const onChangeModVersion = ({ target }: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    setModVersion(target.value as string);
  };

  const onChangeChangelog = (desc: string): void => {
    setChangelog(desc);
  };

  const scriptsInputEventListener = (): void => {
    if (fileRef.current && fileRef.current.files) {
      setFileName(fileRef.current.files[0].name);
    }
  };

  const onUploadScripts = (): void => {
    if (!fileRef.current) return;

    fileRef.current.click();
    fileRef.current.addEventListener('change', scriptsInputEventListener);
  };

  const onSubmit = async (): Promise<void> => {
    if (!fileRef.current || !fileRef.current.files || !modulesStore.activeModule || releaseError) return;

    setLoading(true);
    const newRelease = await createRelease(modulesStore.activeModule.id, releaseVersion, modVersion, fileRef.current.files[0], changelog);
    setLoading(false);

    runInAction(() => {
      modulesStore.activeModule.releases.push(newRelease);
    });
    getModules();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      classes={{
        paper: classes.root,
      }}
    >
      {modulesStore.activeModule && (
        <Typography variant="h5">
          {`Create Release for ${modulesStore.activeModule.name}`}
        </Typography>
      )}
      <div className={classes.versions}>
        <TextField
          label="Release Version"
          placeholder="0.0.1"
          value={releaseVersion}
          onChange={onChangeReleaseVersion}
          error={releaseError}
          helperText={releaseError ? 'The release version must follow SemVer' : ''}
          fullWidth
          autoFocus
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          className={classes.textField}
          label="Target CT Mod Version"
          value={modVersion}
          onChange={onChangeModVersion}
          select
          fullWidth
          InputLabelProps={{ shrink: true }}
          SelectProps={{
            margin: 'dense',
            MenuProps: {
              style: {
                maxHeight: 400,
              },
            },
          }}
        >
          {apiStore.ctVersions.map(version => <MenuItem key={version} value={version}>{version}</MenuItem>)}
        </TextField>
        <label htmlFor="module-file-upload">
          <input
            ref={fileRef}
            id="module-file-upload"
            accept=".zip"
            type="file"
            hidden
          />
          <div>
            <Button className={classes.scriptButton} variant="contained" onClick={onUploadScripts}>
              Upload Scripts
            </Button>
            <Container style={{ textAlign: 'center' }}>
              {fileName}
            </Container>
          </div>
        </label>
      </div>
      <div className={classes.editor}>
        <MarkdownEditor value={changelog} handleChange={onChangeChangelog} shouldBeChangelog />
      </div>
      <div className={classes.buttons}>
        <Button
          className={classes.submitButton}
          variant="contained"
          onClick={onSubmit}
          disabled={releaseError}
        >
          {loading ? <CircularProgress /> : 'Submit'}
        </Button>
        <Button
          className={classes.cancelButton}
          variant="contained"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  );
};
