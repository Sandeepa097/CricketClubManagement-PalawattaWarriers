import cluster from 'cluster';
import os from 'os';
import app from './app';
import { PORT } from './config/config';

if (cluster.isPrimary) {
  const numberOfWorkers = os.cpus().length;
  for (var i = 0; i < numberOfWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', function () {
    cluster.fork();
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
