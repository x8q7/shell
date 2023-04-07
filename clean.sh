echo "======================start======================="
# copy bing picture
file_count=$(ls -l ./bing_picture |grep "^-"|wc -l)
cur_index=${file_count}
for i in $(ls ./BingWallpaper* | grep "BingWallpaper*")
do
    cur_index=$(($cur_index+1))
    mv $i "./bing_picture/BingWallpaper(${cur_index}).jpg"
done

mv *.exe ./exe_msi/
mv *.msi ./exe_msi/
mv *.jpg ./picture/
mv *.webp ./picture/
mv *.png ./picture/
mv *.zip ./zip/
mv *.pdf ./pdf/
mv *.md ./markdown
mv *.word ./office
mv *.xlsx ./office
mv *.csv ./office
echo "======================end======================="
