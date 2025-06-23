## List of duties

### Important commands

```
<<set _unit = $dutylist.getUnitIfAvailable('doctor')>>
<<if _unit>>
  You have a doctor <<rep _unit>>.
<<else>>
  You do not have a doctor.
<</if>>
```

```
<<set _unit = $dutylist.getDutySlaver('doctor', 'viceleader')>>
<<Rep _unit>> will be your doctor if you have one available,
your vice leader if you have a vice leader available but no doctor,
or some random slaver if you don't have either.
```

### Duty list

Please check the `id` of the duty from the in-game Database.
