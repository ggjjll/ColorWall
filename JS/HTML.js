/**
 * Created by Administrator on 2016/4/25 0025.
 */
var $main;
var $gameOver;
var block_bottom;
var color_length = color.length;
var overColorNum = color.length + 5 ;
var score = 0;
var scoreTop ;
var isStart = false;
var time = null;
$(function()
{
    $main = $("#main");
    $gameOver = $("#gameOver");
    var main_width = $main.width();
    block_bottom = main_width * 0.01;
    $main.css("height",main_width + "px");
    var block_height = main_width * 0.09;
    makeBlock();
    $(".block").css("lineHeight",block_height + "px");
    $main.hide();
    $("#reload").on("click",testIsStart);
    scoreTop = 3000;
});
function testIsStart()
{
    if(isStart)
    {
        window.location.reload();
    }
    else
    {
        $main.show();
        $gameOver.hide();
        $main.html("");
        makeBlock();
        $("#reload").html("重新开始");
        score = 0;
        $("#score").html(score);

        $("#maxScore").html(scoreTop);
        var outTime = 30;
        var outTime_box_width = $("#outTime_box").width();
        $outTime_box_main = $("#outTime_box_main");
        time = setInterval(function(){
            outTime --;
            var outTime_box_main_width = outTime / 30 * outTime_box_width;
            $outTime_box_main.width(outTime_box_main_width + "px");
            $("#outTime_time").html(outTime + "秒");
            if(outTime >= 20)
                $outTime_box_main.css("backgroundColor","#20b2aa");
            if(outTime < 20)
                $outTime_box_main.css("backgroundColor","#ff8c00");
            if(outTime < 10)
                $outTime_box_main.css("backgroundColor","#dc143c");
            if(outTime <= 0 )
            {
                $main.hide();
                $gameOver.show();
                $gameOver.html("游戏失败");
                clearInterval(time);
            }
        },1000);
    }
    isStart = !isStart;
}
function pxToNum(string)
{
    return parseInt(string.substring(0,string.length-2));
}
function makeBlock()
{
    for(var i = 0; i < 10; i++)
        $main.append('<div class="strip"></div>');
    var a = 0;
    $(".strip").each(function(){
        var b = 9;
        for(var i = 0; i < 10; i++)
        {
            var randNum = parseInt(Math.random()*color_length);
            addBlock($(this),randNum);
            blockColor[b --][a] = randNum;
        }
        reloadStrip($(this));
        $(this).children(".block").each(function()
        {
            var $thisBlock = $(this);
            $thisBlock.on("click",function(){changHeight($thisBlock)});
        });
        a ++;
    })
}
function addBlock($this,randNum)
{
    var thisBackgroundColor = color[randNum];
    $this.append('<div class="block" style="background-color:'+ thisBackgroundColor +'" '+'colorNum='+randNum+'></div>');
}
function reloadStrip($strip)
{
    $strip.children(".block").each(function()
    {
        var $this = $(this);
        $this.on("click",function(){changHeight($this)});
        /*有上一个兄弟元素*/
        if($this.prev().html() != undefined)
        {
            var $prev = $this.prev();
            var prev_bottom_px = $prev.css("bottom") + "";
            var prev_bottom = pxToNum(prev_bottom_px);
            var prev_height = $prev.height();
            var this_bottom_px = prev_bottom + prev_height + block_bottom + "px";
            $this.css("bottom",this_bottom_px);
        }
        else
            $this.css("bottom",block_bottom + "px");
    })
}
function changHeight($this)
{
    var $this_parents = $this.parents(".strip");
    var stripN = $this_parents.index();                 //列
    var blockN = $this_parents.children().index($this); //行
    var thisBlockColor = $this.attr("colorNum");
    changeBlockColor(9-blockN,stripN,thisBlockColor);
    findOverColor();
    removeBlock();
}
function isHave(blockColor_i,blockColor_j)
{
    if(blockColor_i >= 0 && blockColor_i < 10 && blockColor_j >= 0 && blockColor_j < 10)
        return true;
    else
        return false;
}
function changeBlockColor(blockColor_i,blockColor_j,thisBlockColor)
{
    if(isHave(blockColor_i,blockColor_j))
        blockColor[blockColor_i][blockColor_j] = overColorNum;
    /*上*/
    if(isHave(blockColor_i-1,blockColor_j) && blockColor[blockColor_i-1][blockColor_j] == thisBlockColor)
    {
        blockColor[blockColor_i-1][blockColor_j] = overColorNum;
        changeBlockColor(blockColor_i-1,blockColor_j,thisBlockColor);
    }
    /*下*/
    if(isHave(blockColor_i+1,blockColor_j) && blockColor[blockColor_i+1][blockColor_j] == thisBlockColor)
    {
        blockColor[blockColor_i+1][blockColor_j] = overColorNum;
        changeBlockColor(blockColor_i+1,blockColor_j,thisBlockColor);
    }
    /*左*/
    if(isHave(blockColor_i,blockColor_j-1) && blockColor[blockColor_i][blockColor_j-1] == thisBlockColor)
    {
        blockColor[blockColor_i][blockColor_j-1] = overColorNum;
        changeBlockColor(blockColor_i,blockColor_j-1,thisBlockColor);
    }
    /*右*/
    if(isHave(blockColor_i,blockColor_j+1) && blockColor[blockColor_i][blockColor_j+1] == thisBlockColor)
    {
        blockColor[blockColor_i][blockColor_j+1] = overColorNum;
        changeBlockColor(blockColor_i,blockColor_j+1,thisBlockColor);
    }
}
function findOverColor()
{
    var mach = 0;
    for(var i = 0; i < 10; i ++)
    {
        for(var j = 0; j < 10; j ++)
            if(blockColor[i][j] == overColorNum)
            {
                mach ++;
                changeBlackgroung(i,j,mach);
            }
    }
}
var $removeObj = [];
var removeObj_len = 0;
function changeBlackgroung(i,j,mach)
{
    var $strip = $(".strip").eq(j);
    var $block = $strip.children().eq(9-i);
    $block.css("backgroundColor","#e3e3e3");
    $block.html("+" + mach);
    score += mach;
    $("#score").html(score);
    if(score > scoreTop)
    {
        $main.hide();
        $gameOver.html("挑战成功");
        $gameOver.show();
        clearInterval(time);
        $("#reload").html("下一关");
        isStart = !isStart;
        scoreTop += 5000;
    }
    $removeObj[removeObj_len ++] = $block;
}
var $thisRemove;
var $this_parents;
function removeBlock()
{
    setTimeout(function(){
        for(var i = 0; i < removeObj_len; i++)
        {
            $thisRemove = $removeObj[i];
            $this_parents = $thisRemove.parents(".strip");
            $thisRemove.remove();
            reloadStrip($this_parents);
            $removeObj[i] = null;
        }
        removeObj_len = 0;
        reloadBlockColor();
    },250);
}
function reloadBlockColor()
{
    var blockColor_j = 0;
    $(".strip").each(function()
    {
        var blockColor_i = 9;
        $(this).children(".block").each(function()
        {
            blockColor[blockColor_i --][blockColor_j] = $(this).attr("colorNum");
        });
        for(;blockColor_i >= 0; blockColor_i --)
        {
            var randNum = parseInt(Math.random()*color_length);
            addBlock($(this),randNum);
            reloadStrip($(this));
            blockColor[blockColor_i][blockColor_j] = randNum;
        }
        blockColor_j ++;
    });
    for(;blockColor_j <= 9; blockColor_j ++)
    {
        for(var blockColor_i = 9;blockColor_i >= 0; blockColor_i --)
        {
            blockColor[blockColor_i][blockColor_j] = -1;
        }
    }
//    showBlockColor()
}
/*
function showBlockColor()
{
    for(var i = 0; i < 10; i ++)
    {
        var str = "";
        for(var j = 0; j < 10; j ++)
            str += blockColor[i][j] >= 0 ? " " + blockColor[i][j] + "  " : blockColor[i][j] + "  ";
        console.log(str);
    }
    console.log("");
}*/