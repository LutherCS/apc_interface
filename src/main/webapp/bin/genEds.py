gen_eds = ["BL", "SKL", "WEL", "REL", "NWL", "NWNL", "HB", "HBSSM", "HE", "HEPT", "INTCL", "HIST", "QUANT", "WRITING", "J2"]
titles  = ["Bible", "Skill", "Wellness", "Religion", "Natural World Lab", "Natural World Non-Lab", "Human Behavior", "Human Behavior Social Science Methods", "Human Expression", "Human Expression Primary Texts", "Intercultural", "History", "Quantititive", "Writing", "January Term 2"]

with open("genEdData.json", "w") as f:
	f.write("[\n")
	for i, ed in enumerate(gen_eds):
		f.write("    {\n")
		f.write('        "name": "{0}",\n'.format(ed))
		f.write('        "title": "{0}",\n'.format(titles[i]))
		f.write('        "effective": {0},\n'.format('"1483-12-10T06:00:00.000Z"'))
		f.write('        "end": {0}\n'.format("null"))
		if i == len(gen_eds) - 1:
			f.write("    }\n")
		else:
			f.write("    },\n")
	f.write("]")