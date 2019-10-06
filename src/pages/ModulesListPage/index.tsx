import React from 'react';
import { withStyles } from '@material-ui/styles';
import { getModules, getCurrentAccount, loadTags } from '~api';
import { modulesStore, observer } from '~store';
import {
  Drawer,
  StyledComponent,
  Mobile,
  Styles,
} from '~components';
import Module from '~components/Module';
import FloatingActionButton from '~components/Module/FloatingActionButton';
import ModuleSkeleton from '~components/Module/ModuleSkeleton';
import MobilePagination from '~components/Mobile/Pagination';
import MobileFilterButton from '~components/Mobile/FilterButton';

const styles: Styles = () => ({
  modules: {
    width: '100vw',
  },
});

@observer
class ModulesListPage extends StyledComponent<typeof styles> {
  public componentDidMount = async (): Promise<void> => {
    if (modulesStore.modules.length === 0) {
      getModules();
      getCurrentAccount();
      loadTags();
    }
  }

  public render(): JSX.Element {
    const modules = modulesStore.modules.map(module => <Module key={module.id} module={module} />);

    return (
      <Drawer title="Modules">
        <FloatingActionButton />
        <Mobile>
          <MobilePagination />
          <MobileFilterButton />
        </Mobile>
        <div className={this.classes.modules}>
          {modulesStore.modules.length > 0 ? modules : Array(3).fill(undefined).map((_, i) => i).map(n => <ModuleSkeleton key={n} />)}
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(ModulesListPage);
