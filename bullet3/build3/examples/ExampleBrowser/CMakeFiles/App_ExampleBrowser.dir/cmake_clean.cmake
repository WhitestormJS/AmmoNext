file(REMOVE_RECURSE
  "App_ExampleBrowser.pdb"
  "App_ExampleBrowser.js"
  "App_ExampleBrowser.js.manifest"
)

# Per-language clean rules from dependency scanning.
foreach(lang )
  include(CMakeFiles/App_ExampleBrowser.dir/cmake_clean_${lang}.cmake OPTIONAL)
endforeach()
