file(REMOVE_RECURSE
  "AppBasicExampleGui.pdb"
  "AppBasicExampleGui.js"
  "AppBasicExampleGui.js.manifest"
)

# Per-language clean rules from dependency scanning.
foreach(lang )
  include(CMakeFiles/AppBasicExampleGui.dir/cmake_clean_${lang}.cmake OPTIONAL)
endforeach()
