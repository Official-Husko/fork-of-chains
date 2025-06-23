import { } from '../job'

setup.job = {}

setup.job.slaver = new setup.Job('slaver', 'Slaver')
setup.job.slave = new setup.Job('slave', 'Slave')
setup.job.retired = new setup.Job('retired', 'Retired')
setup.job.unemployed = new setup.Job('unemployed', 'Not in company')
