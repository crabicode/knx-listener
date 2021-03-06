#!/usr/bin/env node
"use strict";
const yargs = require("yargs");
const chalk = require("chalk");
const bus_listener_1 = require("../dist/bus-listener");
const index_1 = require("../dist/utils/index");
const util_1 = require("util");
const argv = yargs.usage('Usage $0 -s <ip address>')
    .demand(['server'])
    .alias('p', 'port')
    .alias('s', 'server')
    .alias('t', 'timeout')
    .default('port', 3671)
    .default('timeout', 0)
    .describe('server', 'Remote ip address')
    .describe('port', 'Remote port number')
    .describe('t', 'Seconds to retry, 0 - fail on first attemp')
    .help('help')
    .alias('h', 'help')
    .coerce('server', (ip) => {
    if (!index_1.isIPv4(ip)) {
        throw new Error(`Invalid ip address ${ip}`);
    }
    return ip;
})
    .coerce('port', (port) => {
    const portNumber = +port;
    if (portNumber < 0 || 65535 < portNumber) {
        throw new Error(`Invalid port number ${portNumber}`);
    }
    return portNumber;
})
    .coerce('timeout', (timeout) => {
    return ((+timeout) >>> 0) * 1000;
})
    .example('$0 -s 10.10.10.0', 'Will listen bus through 10.10.10.0 knx gateway')
    .epilog(util_1.format('GitHub: %s', chalk.underline('https://github.com/crabicode/knx-listener')))
    .argv;
console.log(`Listening ${argv.server}:${argv.port}`);
const server = new bus_listener_1.BusListener();
const die = () => {
    return server.disconnect().then(() => process.exit(), () => process.exit());
};
const fail = (format, ...param) => {
    console.error(chalk.red(`[ FAIL ]`) + ` ${util_1.format(format, ...param)}`);
};
const ok = (format, ...param) => {
    console.error(chalk.green(`[ OK ]`) + ` ${util_1.format(format, ...param)}`);
};
process.on('SIGINT', die);
server.bind(argv.server, argv.port, {
    timeout: argv.timeout,
    onFailure: (err) => {
        fail('Error ocurred while connecting %s', err.code);
    },
}).catch(die);
server.on('query', (query) => {
    const action = ((action) => {
        switch (action) {
            case 0x00: return 'read';
            case 0x40: return 'response';
            case 0x80: return 'write';
            default: return undefined;
        }
        ;
    })(query.action);
    if (action) {
        const knxaddr = index_1.num2knxAddr(query.dest);
        if (action === 'write' || action === 'response') {
            const data = Buffer.from(query.data)
                .toString('hex').match(/.{1,2}/g).join(':');
            ok('%s data %s to %s', action, data, knxaddr);
        }
        if (action === 'read') {
            ok('read %s', knxaddr);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVzbW9uaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1c21vbml0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwrQkFBK0I7QUFDL0IsK0JBQStCO0FBQy9CLHVEQUFtRDtBQUNuRCwrQ0FBMEQ7QUFDMUQsK0JBQTJDO0FBRTNDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUM7S0FDakQsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDbEIsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUM7S0FDbEIsS0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUM7S0FDcEIsS0FBSyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUM7S0FDckIsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7S0FDckIsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7S0FDckIsUUFBUSxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQztLQUN2QyxRQUFRLENBQUMsTUFBTSxFQUFFLG9CQUFvQixDQUFDO0tBQ3RDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsNENBQTRDLENBQUM7S0FDM0QsSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUNaLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDO0tBQ2xCLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFVO0lBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDO0FBQ1osQ0FBQyxDQUFDO0tBQ0QsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQVk7SUFDM0IsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDekIsRUFBRSxDQUFD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QUksTUFBTSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2lCQUNqQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoRCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDdEIsRUFBRSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN6QixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0ICogYXMgY2hhbGsgZnJvbSAnY2hhbGsnO1xuaW1wb3J0IHsgQnVzTGlzdGVuZXIgfSBmcm9tICcuLi9kaXN0L2J1cy1saXN0ZW5lcic7XG5pbXBvcnQgeyBudW0ya254QWRkciwgaXNJUHY0IH0gZnJvbSAnLi4vZGlzdC91dGlscy9pbmRleCc7XG5pbXBvcnQgeyBmb3JtYXQgYXMgc3RyRm9ybWF0IH0gZnJvbSAndXRpbCc7XG5cbmNvbnN0IGFyZ3YgPSB5YXJncy51c2FnZSgnVXNhZ2UgJDAgLXMgPGlwIGFkZHJlc3M+JylcbiAgLmRlbWFuZChbJ3NlcnZlciddKVxuICAuYWxpYXMoJ3AnLCAncG9ydCcpXG4gIC5hbGlhcygncycsICdzZXJ2ZXInKVxuICAuYWxpYXMoJ3QnLCAndGltZW91dCcpXG4gIC5kZWZhdWx0KCdwb3J0JywgMzY3MSlcbiAgLmRlZmF1bHQoJ3RpbWVvdXQnLCAwKVxuICAuZGVzY3JpYmUoJ3NlcnZlcicsICdSZW1vdGUgaXAgYWRkcmVzcycpXG4gIC5kZXNjcmliZSgncG9ydCcsICdSZW1vdGUgcG9ydCBudW1iZXInKVxuICAuZGVzY3JpYmUoJ3QnLCAnU2Vjb25kcyB0byByZXRyeSwgMCAtIGZhaWwgb24gZmlyc3QgYXR0ZW1wJylcbiAgLmhlbHAoJ2hlbHAnKVxuICAuYWxpYXMoJ2gnLCAnaGVscCcpXG4gIC5jb2VyY2UoJ3NlcnZlcicsIChpcDogc3RyaW5nKSA9PiB7XG4gICAgaWYgKCFpc0lQdjQoaXApKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaXAgYWRkcmVzcyAke2lwfWApO1xuICAgIH1cbiAgICByZXR1cm4gaXA7XG4gIH0pXG4gIC5jb2VyY2UoJ3BvcnQnLCAocG9ydDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgcG9ydE51bWJlciA9ICtwb3J0O1xuICAgIGlmIChwb3J0TnVtYmVyIDwgMCB8fCA2NTUzNSA8IHBvcnROdW1iZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBwb3J0IG51bWJlciAke3BvcnROdW1iZXJ9YCk7XG4gICAgfVxuICAgIHJldHVybiBwb3J0TnVtYmVyO1xuICB9KVxuICAuY29lcmNlKCd0aW1lb3V0JywgKHRpbWVvdXQ6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiAoKCt0aW1lb3V0KSA+Pj4gMCkgKiAxMDAwO1xuICB9KVxuICAuZXhhbXBsZSgnJDAgLXMgMTAuMTAuMTAuMCcsICdXaWxsIGxpc3RlbiBidXMgdGhyb3VnaCAxMC4xMC4xMC4wIGtueCBnYXRld2F5JylcbiAgLmVwaWxvZyhzdHJGb3JtYXQoJ0dpdEh1YjogJXMnLCBjaGFsay51bmRlcmxpbmUoJ2h0dHBzOi8vZ2l0aHViLmNvbS9jcmFiaWNvZGUva254LWxpc3RlbmVyJykpKVxuICAuYXJndjtcblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbmNvbnNvbGUubG9nKGBMaXN0ZW5pbmcgJHthcmd2LnNlcnZlcn06JHthcmd2LnBvcnR9YCk7XG5cbmNvbnN0IHNlcnZlciA9IG5ldyBCdXNMaXN0ZW5lcigpO1xuXG5jb25zdCBkaWUgPSAoKSA9PiB7XG4gIHJldHVybiBzZXJ2ZXIuZGlzY29ubmVjdCgpLnRoZW4oXG4gICAgKCkgPT4gcHJvY2Vzcy5leGl0KCksXG4gICAgKCkgPT4gcHJvY2Vzcy5leGl0KCksXG4gICk7XG59O1xuXG5jb25zdCBmYWlsID0gKGZvcm1hdDogYW55LCAuLi5wYXJhbTogYW55W10pID0+IHtcbiAgY29uc29sZS5lcnJvcihcbiAgICBjaGFsay5yZWQoYFsgRkFJTCBdYCkgKyBgICR7c3RyRm9ybWF0KGZvcm1hdCwgLi4ucGFyYW0pfWAsXG4gICk7XG59O1xuXG5jb25zdCBvayA9IChmb3JtYXQ6IGFueSwgLi4ucGFyYW06IGFueVtdKSA9PiB7XG4gIGNvbnNvbGUuZXJyb3IoXG4gICAgY2hhbGsuZ3JlZW4oYFsgT0sgXWApICsgYCAke3N0ckZvcm1hdChmb3JtYXQsIC4uLnBhcmFtKX1gLFxuICApO1xufTtcblxuLy8gQ2xvc2UgdHVubmVsaW5nIG9uIGN0cmwrY1xucHJvY2Vzcy5vbignU0lHSU5UJywgZGllKTtcblxuc2VydmVyLmJpbmQoYXJndi5zZXJ2ZXIsIGFyZ3YucG9ydCwge1xuICB0aW1lb3V0OiBhcmd2LnRpbWVvdXQsXG4gIG9uRmFpbHVyZTogKGVycjogRXJyb3IgJiB7IGNvZGU6IHN0cmluZyB9KSA9PiB7XG4gICAgZmFpbCgnRXJyb3Igb2N1cnJlZCB3aGlsZSBjb25uZWN0aW5nICVzJywgZXJyLmNvZGUpO1xuICB9LFxufSkuY2F0Y2goZGllKTtcblxuc2VydmVyLm9uKCdxdWVyeScsIChxdWVyeTogYW55KSA9PiB7XG4gIGNvbnN0IGFjdGlvbiA9ICgoYWN0aW9uKSA9PiB7XG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgIGNhc2UgMHgwMDogcmV0dXJuICdyZWFkJztcbiAgICAgIGNhc2UgMHg0MDogcmV0dXJuICdyZXNwb25zZSc7XG4gICAgICBjYXNlIDB4ODA6IHJldHVybiAnd3JpdGUnO1xuICAgICAgZGVmYXVsdDogcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICB9KShxdWVyeS5hY3Rpb24pO1xuICBpZiAoYWN0aW9uKSB7XG4gICAgY29uc3Qga254YWRkciA9IG51bTJrbnhBZGRyKHF1ZXJ5LmRlc3QpO1xuICAgIGlmIChhY3Rpb24gPT09ICd3cml0ZScgfHwgYWN0aW9uID09PSAncmVzcG9uc2UnKSB7XG4gICAgICBjb25zdCBkYXRhID0gQnVmZmVyLmZyb20ocXVlcnkuZGF0YSlcbiAgICAgICAgLnRvU3RyaW5nKCdoZXgnKS5tYXRjaCgvLnsxLDJ9L2cpLmpvaW4oJzonKTtcbiAgICAgIG9rKCclcyBkYXRhICVzIHRvICVzJywgYWN0aW9uLCBkYXRhLCBrbnhhZGRyKTtcbiAgICB9XG4gICAgaWYgKGFjdGlvbiA9PT0gJ3JlYWQnKSB7XG4gICAgICBvaygncmVhZCAlcycsIGtueGFkZHIpO1xuICAgIH1cbiAgfVxufSk7XG4iXX0=